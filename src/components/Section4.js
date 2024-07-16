import React, { useEffect, useRef } from 'react';
import './Section4.css'; 
import { Link } from 'react-router-dom';
import video1 from '../assets/video2.mp4';
import video2 from '../assets/video3.mp4';
import video3 from '../assets/video4.mp4';
import video4 from '../assets/video4.mp4';
import video5 from '../assets/video4.mp4';
import video6 from '../assets/video4.mp4';
import video7 from '../assets/video4.mp4';
import video8 from '../assets/video4.mp4';
import video9 from '../assets/video4.mp4';
import video10 from '../assets/video4.mp4';
// Import other videos as needed

const videoFiles = [
    video1,
    video2,
    video3,
    video4,
    video5,
    video6,
    video7,
    video8,
    video9,
    video10,
    // Add more video imports as needed
];

const getTodaysVideo = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return videoFiles[dayOfYear % videoFiles.length]; // Cycle through videos
};

const Section4 = React.forwardRef((props, ref) => {
    const videoSrc = getTodaysVideo();
    const videoRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            setTimeout(() => {
                videoRef.current.classList.add('fade-in');
            }, 800); // Adjust the delay as needed

            videoRef.current.addEventListener('mouseenter', () => {
                videoRef.current.play();
            });

            videoRef.current.addEventListener('mouseleave', () => {
                videoRef.current.pause();
            });
        }

        if (buttonRef.current) {
            setTimeout(() => {
                buttonRef.current.classList.add('fade-in');
            }, 1600); // Adjust the delay as needed
        }
    }, []);

    return (
        <div id="section4" className="section" ref={ref}>
            <div className="overlay-v">
                <video ref={videoRef} className="middle-video" controls muted>
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <Link to="/">
                    <button ref={buttonRef} className="video-button">Go chase your dreams</button>
                </Link>
            </div>
        </div>
    );
});

export default Section4;
