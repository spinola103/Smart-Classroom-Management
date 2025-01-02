import React from 'react';
import './Navbar.css'; 
import { Link } from 'react-router-dom'; // Import Link from React Router

function Navbar() {
    return (
        <header>
            <div className="navbar">
                <div className="logo">
                    <span className="heading">Edvance</span>
                </div>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li> {/* Link to the homepage */}
                        <li><Link to="/about">About</Link></li> {/* Example route for About page */}
                        <li><Link to="/contact">Contact</Link></li> {/* Example route for Contact page */}
                        
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
