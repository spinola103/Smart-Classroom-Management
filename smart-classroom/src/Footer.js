import React, { useState, useEffect } from 'react';
import './Footer.css'; // Create corresponding CSS file if needed

function Footer() {
    const [showButton, setShowButton] = useState(false);

    // Show the button when the user scrolls down 300px
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <footer id="footer">
            <div className="footer-content">
                <p>&copy; 2024 Smart Classroom Management System. All rights reserved.</p>
                <p className="footer-note">Follow us on:</p>
                <div className="social-icons">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="fab fa-facebook"></a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="fab fa-twitter"></a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="fab fa-linkedin"></a>
                </div>
            </div>
            <button
                className={`back-to-top ${showButton ? 'show-back-to-top' : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                ⬆️
            </button>
        </footer>
    );
}

export default Footer;
