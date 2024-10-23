import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import './Section1.css'; // Keep the styles for Section1
import Section2 from './Section2';
import Section3 from './Section3';
import { useLocation } from 'react-router-dom';

function Home() {
    const [isSection2Visible, setIsSection2Visible] = useState(false);
    const [isSection3Visible, setIsSection3Visible] = useState(false);
    const [influencerName, setInfluencerName] = useState("");
    const [videoFile, setVideoFile] = useState("");
    const [isButtonVisible, setButtonVisible] = useState(false); // Merged from Section1.js
 

    const section2Ref = useRef(null);
    const section3Ref = useRef(null);
    const location = useLocation();

    // Section1 functionality: Show button after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setButtonVisible(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const scrollTo = params.get('scrollTo');

        if (scrollTo === 'section2') {
            setIsSection2Visible(true); // Directly show Section2
        }
    }, [location]);

    // Scroll to Section2 when "MOTIVDLE GAME" is clicked
    useEffect(() => {
        if (isSection2Visible && section2Ref.current) {
            section2Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSection2Visible]);

    // Scroll to Section3 after the correct answer is given and update styles
    useEffect(() => {
        if (isSection3Visible && section3Ref.current) {
            section3Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSection3Visible]);

    const handleScrollToSection2 = () => {
        setIsSection2Visible(true); // Show Section2 and trigger scroll in useEffect
    };

    const handleSearchTriggerScroll = (name, videoFileName) => {
        setInfluencerName(name);
        setVideoFile(videoFileName);
        setIsSection3Visible(true); // Show Section3 and trigger scroll in useEffect
    };

    return (
        <div style={backgroundStyle}> {/* Apply dynamic background style here */}
            <div className="background-home"></div>

            {/* Section1 Content */}
            <div id="section1" className="section1">
                <h1 className="title-home">MOTIVDLE</h1>
                <p className="description">
                    The game where you guess who says the motivational quote, and in hopes of taking away some inspiration.
                    I'm a big fan of quotes from actual achievers so the quotes are strictly from real-life winners.
                </p>
                <button
                    id="scrollButton"
                    className={`test-button ${isButtonVisible ? 'fade-in' : ''}`}
                    onClick={handleScrollToSection2}
                >
                    MOTIVDLE ROUND 1
                </button>
            </div>

            {/* Section2 Content */}
            {isSection2Visible && (
                <Section2
                    ref={section2Ref}
                    onSearchMatch={handleSearchTriggerScroll} // Pass the handler for correct guess
                />
            )}

            {/* Section3 Content */}
            {isSection3Visible && (
                <Section3
                    ref={section3Ref}
                    influencerName={influencerName}
                    videoFileName={videoFile}
                />
            )}

            <footer className="footer">
                <p>&copy; 2024 Motivdle. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
