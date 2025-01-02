import React from 'react';
import './Hero.css'; // Create corresponding CSS file if needed
import heroImage from './images/book-stack.png'; // Adjust the path to your image
import { Link } from 'react-router-dom';


function Hero() {
    return (
        <section className="hero">
            <div className="content">
                <h1>Empowering Education with AI-Driven Classroom Management</h1>
                <h2>Revolutionizing classrooms with seamless automation, enriching learning, and delivering instant support for students and educators</h2>
                <a href="/login" className="btn-login">LOGIN</a>
            </div>
            <div className="hero-image">
                <img src={heroImage} alt="Books Stack" />
            </div>
        </section>
    );
}

export default Hero;
