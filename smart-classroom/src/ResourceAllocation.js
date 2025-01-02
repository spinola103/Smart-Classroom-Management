import React, { useState } from 'react';
import './ResourceAllocation.css';

const ResourceAllocation = ({ onBack }) => {
    const [numClasses, setNumClasses] = useState('');
    const [numLabs, setNumLabs] = useState('');
    const [numProjectors, setNumProjectors] = useState('');
    const [numLabsPerWeek, setNumLabsPerWeek] = useState('');
    const [numProjectorsPerWeek, setNumProjectorsPerWeek] = useState('');
    const [timetable, setTimetable] = useState(null);

    const allocateResource = () => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const periods = ['1', '2', '3', '4', '5'];
        const timetable = {};
        const resourceUsage = { lab: {}, projector: {} };

        // Initialize timetable and resource usage
        for (let i = 1; i <= numClasses; i++) {
            timetable[`Class-${i}`] = {
                Monday: {}, Tuesday: {}, Wednesday: {}, Thursday: {}, Friday: {}
            };
        }

        days.forEach((day) => {
            periods.forEach((period) => {
                resourceUsage.lab[`${day}-${period}`] = false;
                resourceUsage.projector[`${day}-${period}`] = false;
            });
        });

        // Allocate resources
        for (let i = 1; i <= numClasses; i++) {
            const classKey = `Class-${i}`;
            const allocatedLabs = [];
            const allocatedProjectors = [];

            // Allocate labs
            while (allocatedLabs.length < numLabsPerWeek) {
                const day = days[Math.floor(Math.random() * days.length)];
                const period = periods[Math.floor(Math.random() * periods.length)];
                const slot = `${day}-${period}`;

                if (!resourceUsage.lab[slot]) {
                    resourceUsage.lab[slot] = true;
                    timetable[classKey][day][period] = 'Lab';
                    allocatedLabs.push(slot);
                }
            }

            // Allocate projectors
            while (allocatedProjectors.length < numProjectorsPerWeek) {
                const day = days[Math.floor(Math.random() * days.length)];
                const period = periods[Math.floor(Math.random() * periods.length)];
                const slot = `${day}-${period}`;

                if (!resourceUsage.projector[slot] && !allocatedLabs.includes(slot)) {
                    resourceUsage.projector[slot] = true;
                    timetable[classKey][day][period] = 'Projector';
                    allocatedProjectors.push(slot);
                }
            }
        }

        setTimetable(timetable);
    };

    const handleSubmit = () => {
        allocateResource();
        alert('Resources allocated successfully!');
    };

    return (
        <div className="resource-page-container">
            <h1>Resource Allocation</h1>

            {/* Inputs */}
            <div className="dropdown-container">
                <label>Number of Classes:</label>
                <select value={numClasses} onChange={(e) => setNumClasses(Number(e.target.value))}>
                    <option value="">Select</option>
                    {[...Array(8)].map((_, i) => (
                        <option key={i} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div className="dropdown-container">
                <label>Number of Labs:</label>
                <select value={numLabs} onChange={(e) => setNumLabs(Number(e.target.value))}>
                    <option value="">Select</option>
                    {[...Array(5)].map((_, i) => (
                        <option key={i} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div className="dropdown-container">
                <label>Number of Projector Rooms:</label>
                <select value={numProjectors} onChange={(e) => setNumProjectors(Number(e.target.value))}>
                    <option value="">Select</option>
                    {[...Array(5)].map((_, i) => (
                        <option key={i} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div className="dropdown-container">
                <label>Labs Per Week:</label>
                <select value={numLabsPerWeek} onChange={(e) => setNumLabsPerWeek(Number(e.target.value))}>
                    <option value="">Select</option>
                    {[...Array(7)].map((_, i) => (
                        <option key={i} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div className="dropdown-container">
                <label>Projectors Per Week:</label>
                <select value={numProjectorsPerWeek} onChange={(e) => setNumProjectorsPerWeek(Number(e.target.value))}>
                    <option value="">Select</option>
                    {[...Array(7)].map((_, i) => (
                        <option key={i} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            <button className="submit-button" onClick={handleSubmit}>
                Submit
            </button>

            {/* Display timetable */}
            {timetable && (
                <div>
                    <h2>Timetable</h2>
                    {Object.entries(timetable).map(([classKey, schedule]) => (
                        <div key={classKey}>
                            <h3>{classKey}</h3>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        {['1', '2', '3', '4', '5'].map((period) => (
                                            <th key={period}>Period {period}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                                        <tr key={day}>
                                            <td>{day}</td>
                                            {['1', '2', '3', '4', '5'].map((period) => (
                                                <td key={period}>{schedule[day]?.[period] || '-'}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default ResourceAllocation;
