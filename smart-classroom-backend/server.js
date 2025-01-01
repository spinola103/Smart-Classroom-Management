const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const { Pool } = require('pg');

// Database credentials
const DB_USER = "chatbotadmin";
const DB_PASSWORD = "Manager@2024";
const DB_HOST = "chatbotserver.postgres.database.azure.com";
const DB_NAME = "chatbotdb";

// PostgreSQL pool configuration
const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: 5432, // Default PostgreSQL port
    ssl: {
        rejectUnauthorized: false // Required for Azure PostgreSQL
    }
});

// Test connection
(async () => {
    try {
        const client = await pool.connect();
        console.log("Connected to PostgreSQL database successfully!");
        client.release();
    } catch (err) {
        console.error("Error connecting to PostgreSQL database:", err);
    }
})();

module.exports = pool;

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/edvance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => console.error('MongoDB connection error:', err));

// Course Schema
const CourseSchema = new mongoose.Schema({
    code: String,
    title: String,
    term: String,
    description: String, // Additional details about the course
});

const Course = mongoose.model('Course', CourseSchema);

// Routes
// Get all courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// Add a new course
app.post('/api/courses', async (req, res) => {
    try {
        const course = new Course(req.body);
        const savedCourse = await course.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        res.status(400).json({ error: 'Failed to add course' });
    }
});

// Teacher Schema
const TeacherSchema = new mongoose.Schema({
    teacherId: { type: String, unique: true }, // Unique teacher ID (e.g., T240001)
    name: String, // Teacher's name
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // References to courses
});

const Teacher = mongoose.model('Teacher', TeacherSchema);

// Generate a unique teacher ID
const generateTeacherId = async () => {
    const latestTeacher = await Teacher.findOne().sort({ teacherId: -1 });
    if (!latestTeacher) return 'T240001';
    const latestIdNum = parseInt(latestTeacher.teacherId.substring(1));
    return `T${(latestIdNum + 1).toString().padStart(6, '0')}`; 
};

// Add a new teacher
app.post('/api/teachers', async (req, res) => {
    try {
        const teacherId = await generateTeacherId();
        const teacher = new Teacher({ ...req.body, teacherId });
        const savedTeacher = await teacher.save();
        res.status(201).json(savedTeacher);
    } catch (err) {
        console.error('Error adding teacher:', err);
        res.status(400).json({ error: 'Failed to add teacher' });
    }
});

// Get all teachers
app.get('/api/teachers', async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('courses'); // Populate course details
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch teachers' });
    }
});

// Get courses for a specific teacher by teacherId
app.get('/api/teachers/:teacherId/courses', async (req, res) => {
    try {
        const { teacherId } = req.params;
        const teacher = await Teacher.findOne({ teacherId }).populate('courses');
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        res.json({ courses: teacher.courses });
    } catch (err) {
        console.error('Error fetching courses for teacher:', err);
        res.status(500).json({ error: 'Failed to fetch courses for the teacher' });
    }
});

// Lesson Schema
const LessonSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    name: String,
    audioUrl: String,
    transcription: String,
    keywords: [
        {
            word: String,
            hint: String,
        },
    ],
});

const Lesson = mongoose.model("Lesson", LessonSchema);

// Multer configuration
const upload = multer({ dest: "uploads/" }).single("audio");

// Keyword extraction function
const extractKeywords = (text) => {
    if (!text || text.trim() === "") return [];

    const stopWords = [
        "the", "is", "and", "to", "a", "of", "in", "for", "with", "on", "that",
        "by", "this", "it", "as", "an", "be", "or", "are", "at", "from", "was",
        "but", "has", "have", "they", "we", "their", "its", "will", "can", "may",
        "if", "about", "such", "each", "all", "you", "your", "more", "some", "our",
        "so", "like", "these", "how", "one", "when", "what", "which", "where"
    ];

    // Tokenize and clean text
    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, "") // Remove punctuation
        .split(/\s+/)
        .filter((word) => !stopWords.includes(word) && word.length > 2);

    // Count word frequency
    const wordCount = words.reduce((count, word) => {
        count[word] = (count[word] || 0) + 1;
        return count;
    }, {});

    // Sort words by frequency and select the top 5
    const sortedWords = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word);

    // Generate hints using the context
    const generateHint = (keyword) => {
        const keywordRegex = new RegExp(`([^\\.]*?\\b${keyword}\\b[^\\.]*\\.)`, "i");
        const match = text.match(keywordRegex);

        if (match && match[1]) {
            const sentence = match[1].replace(new RegExp(`\\b${keyword}\\b`, "gi"), "").trim();
            return `Mentioned in the context of: "${sentence}"`;
        }

        return `A significant concept covered in the lecture.`;
    };

    return sortedWords.map((word) => ({
        word,
        hint: generateHint(word),
    }));
};

// Add a new lesson
app.post("/api/lessons", upload, async (req, res) => {
    const { course, name } = req.body;

    if (!course || !name || !req.file) {
        return res
            .status(400)
            .json({ error: "Course, name, and audio file are required." });
    }

    const filePath = req.file.path;

    try {
        const uploadResponse = await axios.post(
            "https://api.assemblyai.com/v2/upload",
            fs.createReadStream(filePath),
            {
                headers: { authorization: "80642e659e7940309b33e706c811189e" },
              }
            );
    
            const audioUrl = uploadResponse.data.upload_url;
    
            const transcriptionResponse = await axios.post(
                "https://api.assemblyai.com/v2/transcript",
                { audio_url: audioUrl },
                {
                    headers: { authorization: "80642e659e7940309b33e706c811189e" },
                }
            );
    
            const transcriptId = transcriptionResponse.data.id;
    
            const pollTranscription = async () => {
                try {
                    const transcript = await axios.get(
                        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
                        {
                            headers: { authorization: "80642e659e7940309b33e706c811189e" },
                        }
                    );
    
                    if (transcript.data.status === "completed") {
                        const transcriptionText = transcript.data.text;
    
                        // Generate keywords from transcription
                        const keywords = extractKeywords(transcriptionText);
    
                        // Save the transcription to PostgreSQL
                        try {
                            const query = `
                                INSERT INTO transcriptions (text, "timestamp")
                                VALUES ($1, $2) RETURNING *;
                            `;
                            const timestamp = new Date().toISOString(); // Ensures precise timestamp
                            const values = [transcriptionText, timestamp];
    
                            // Use your PostgreSQL pool object
                            const result = await pool.query(query, values);
                            console.log('Transcription saved to PostgreSQL:', result.rows[0]);
                        } catch (error) {
                            console.error('Error saving transcription to PostgreSQL:', error);
                        }
    
                        // Create and save the lesson
                        const lesson = new Lesson({
                            course,
                            name,
                            audioUrl,
                            transcription: transcriptionText,
                            keywords,
                        });
    
                        await lesson.save();
    
                        // Clean up uploaded file
                        fs.unlinkSync(filePath);
    
                        return res.status(201).json(lesson);
                    } else if (transcript.data.status === "failed") {
                        // Clean up uploaded file even if transcription fails
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                        return res.status(500).json({ error: "Transcription failed." });
                    } else {
                        setTimeout(pollTranscription, 5000); // Poll every 5 seconds
                    }
                } catch (pollError) {
                    // Clean up uploaded file if polling fails
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                    return res
                        .status(500)
                        .json({ error: "Error during transcription polling: " + pollError.message }); // Include error message for debugging
                }
            };
    
            pollTranscription();
        } catch (error) {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            res.status(500).json({ error: "Error uploading or transcribing audio: " + error.message}); //Include error message for debugging
        }
    });
    
    // Get lesson by ID
    app.get("/api/lessons/:lessonId", async (req, res) => {
        const { lessonId } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({ error: "Invalid lesson ID" });
        }
    
        try {
            const lesson = await Lesson.findById(lessonId).populate("course");
            if (!lesson) {
                return res.status(404).json({ error: "Lesson not found" });
            }
            res.json(lesson);
        } catch (err) {
            res.status(500).json({ error: "Failed to fetch the lesson" });
        }
    });
    
    // Get all lessons
    app.get('/api/lessons', async (req, res) => {
        try {
            const lessons = await Lesson.find().populate('course');
            res.json(lessons);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch lessons' });
        }
    });
    
    app.get('/api/courses/:courseId/lessons', async (req, res) => {
        const { courseId } = req.params;
        try {
            const lessons = await Lesson.find({ course: courseId }).populate('course');
            res.json(lessons);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch lessons for the course' });
        }
    });
    
    
    // Mongoose schema and model
    const GameSchema = new mongoose.Schema({
        name: String, // Player name
        unique_id: { type: String, unique: true }, // Unique player ID
        points: Number, // Player's points
    }, { collection: "game" }); // Explicit collection name
    
    const Game = mongoose.model("Game", GameSchema);
    
    // Fetch the top 5 students (Leaderboard)
    app.get("/api/leaderboard", async (req, res) => {
        try {
            const topStudents = await Game.find()
                .sort({ points: -1 })
                .limit(5)
                .select("name unique_id points -_id"); // Select only required fields
            if (topStudents.length === 0) {
                return res.status(404).json({ message: "No students found." });
            }
            res.status(200).json(topStudents);
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
            res.status(500).json({ error: "Failed to fetch leaderboard." });
        }
    });
    
    // Fetch rank of a specific student
    app.get("/api/rank/:unique_id", async (req, res) => {
        const { unique_id } = req.params;
    
        try {
            // Fetch the specific student directly
            const student = await Game.findOne({ unique_id }).select("name unique_id points -_id");
            if (!student) {
                return res.status(404).json({ error: "Student not found." });
            }
    
            // Calculate rank based on points
            const rank = await Game.countDocuments({ points: { $gt: student.points } }) + 1;
    
            res.status(200).json({ rank, student });
        } catch (err) {
            console.error("Error fetching rank:", err);
            res.status(500).json({ error: "Failed to fetch rank." });
        }
    });

    const collectionName = "attendance"; 

    app.get('/attendance/all', async (req, res) => {
        try {
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection('weekly_attendance'); // Replace with your actual collection name
      
            // Fetch all documents
            const documents = await collection.find({}).toArray();
      
            if (documents.length === 0) {
                return res.status(404).json({ error: 'No data found in the weekly_attendance collection.' });
            }
      
            res.json(documents); // Send all documents as the response
        } catch (error) {
            console.error('Error fetching all attendance data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            await client.close();
        }
    });
    
    
    
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });