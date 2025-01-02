import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./LessonDetails.css";

const LessonDetails = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [points, setPoints] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [words, setWords] = useState([]);
  const [studentId, setStudentId] = useState(null); // Store student ID

  // Fetch student ID on component mount
  useEffect(() => {
    const storedStudentId =
      sessionStorage.getItem("uniqueId") || localStorage.getItem("uniqueId");
    if (storedStudentId) {
      setStudentId(storedStudentId);
    } else {
      alert("Student not logged in. Redirecting to login...");
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/lessons/${lessonId}`
        );
        setLesson(response.data);

        // Prepare 5 random keywords for the game
        const selectedKeywords = response.data.keywords
          .sort(() => 0.5 - Math.random())
          .slice(0, 5)
          .map((keyword) => ({
            word: keyword.word.toUpperCase(),
            hint: keyword.hint,
          }));
        setWords(selectedKeywords);
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Could not load lesson details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const currentWord = words[currentWordIndex]?.word || "";
  const currentHint = words[currentWordIndex]?.hint || "";

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || wrongGuesses >= 6) return;

    if (currentWord.includes(letter)) {
      setGuessedLetters((prev) => [...prev, letter]);
    } else {
      setWrongGuesses((prev) => prev + 1);
    }
  };

  const handleNextWord = () => {
    if (currentWord.split("").every((letter) => guessedLetters.includes(letter))) {
      setPoints((prev) => prev + 10); // Award 10 points for a correct guess
    }

    if (wrongGuesses < 6) {
      setPoints((prev) => prev + (6 - wrongGuesses) * 2); // Bonus for fewer wrong guesses
    }

    // Reset state for the next word
    setGuessedLetters([]);
    setWrongGuesses(0);

    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      setGameComplete(true); // End the game after the last word
    }
  };

  const renderWord = () => {
    return currentWord
      .split("")
      .map((letter, index) => (
        <span
          key={index}
          className={`letter ${guessedLetters.includes(letter) ? "revealed" : ""}`}
        >
          {guessedLetters.includes(letter) ? letter : "_"}
        </span>
      ));
  };

  const renderHangman = () => {
    return (
      <div className="hangman">
        <div className={`hangman-part head ${wrongGuesses > 0 ? "show" : ""}`} />
        <div className={`hangman-part body ${wrongGuesses > 1 ? "show" : ""}`} />
        <div className={`hangman-part left-arm ${wrongGuesses > 2 ? "show" : ""}`} />
        <div className={`hangman-part right-arm ${wrongGuesses > 3 ? "show" : ""}`} />
        <div className={`hangman-part left-leg ${wrongGuesses > 4 ? "show" : ""}`} />
        <div className={`hangman-part right-leg ${wrongGuesses > 5 ? "show" : ""}`} />
      </div>
    );
  };

  // Update points in the database at the end of the game
  const updatePointsInDB = async () => {
    if (!studentId) return;

    try {
      const response = await axios.put("http://localhost:5000/api/user/update-points", {
        points,
        userId: studentId,
      });
      console.log("Points updated successfully:", response.data);
    } catch (err) {
      console.error("Error updating points in the database:", err);
    }
  };

  useEffect(() => {
    if (gameComplete) {
      updatePointsInDB();
    }
  }, [gameComplete]); // Trigger point update when the game ends

  if (loading) {
    return <p>Loading lesson...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (gameComplete) {
    return (
      <div className="game-complete">
        <h2>Game Over!</h2>
        <p>
          Your total points: <strong>{points}</strong>
        </p>
        <p>Thanks for playing!</p>
      </div>
    );
  }

  const isWordGuessed = currentWord.split("").every((letter) => guessedLetters.includes(letter));

  return (
    <div className="word-guessing-game">
      <h2 className="lesson-title">{lesson?.name || "Word Guessing Game"}</h2>

      <div className="hint-section">
        <strong>Hint:</strong>
        <p>{currentHint}</p>
      </div>

      <div className="word-section">{renderWord()}</div>
      <div className="hangman-section">{renderHangman()}</div>

      <div className="keyboard">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
          <button
            key={letter}
            className="keyboard-key"
            onClick={() => handleGuess(letter)}
            disabled={
              guessedLetters.includes(letter) ||
              wrongGuesses >= 6 ||
              isWordGuessed
            }
          >
            {letter}
          </button>
        ))}
      </div>

      {isWordGuessed && (
        <p className="game-result win">Great job! You guessed the word!</p>
      )}
      {wrongGuesses >= 6 && (
        <p className="game-result lose">
          You lost this round! The word was: {currentWord}
        </p>
      )}

      <button
        className="next-button"
        onClick={handleNextWord}
        disabled={!isWordGuessed && wrongGuesses < 6}
      >
        Next Word
      </button>

      <div className="points-section">
        <p>
          Current Points: <strong>{points}</strong>
        </p>
        <p>
          Word {currentWordIndex + 1} of {words.length}
        </p>
      </div>
    </div>
  );
};

export default LessonDetails;
