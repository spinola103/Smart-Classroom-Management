import React from 'react';
import './Features.css'; // Ensure correct path

const FeatureItem = ({ iconSrc, title, description }) => (
    <div className="feature-item">
        <div className="feature-icon">
            <img src={iconSrc} alt={`${title} Icon`} />
        </div>
        <div className="feature-content">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    </div>
);

const Features = () => {
    return (
        <section className="features" id="features">
            <h2>Key Insights</h2>
            <FeatureItem
                iconSrc={require('./images/icon-attendance.png')}
                title="Seamless Attendance Automation"
                description="Utilize facial recognition to effortlessly log student attendance at both entry and exit points, ensuring accurate and real-time records."
            />
            <FeatureItem
                iconSrc={require('./images/icon-ai.png')}
                title="AI-Powered Learning Insights"
                description="Transform student performance with personalized AI-driven analysis, identifying learning gaps and providing tailored solutions."
            />
            <FeatureItem
                iconSrc={require('./images/icon-analysis.png')}
                title="Comprehensive Post-Class Analysis"
                description="Empower teachers, students, and administrators with detailed post-class reports."
            />
            <FeatureItem
                iconSrc={require('./images/icon-iot.png')}
                title="Smart Resource and Safety Management"
                description="Optimize classroom resources and ensure a secure learning environment with safety alerts."
            />
        </section>
    );
};

export default Features;
