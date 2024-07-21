// src/components/Section4.js
import React, { useEffect, useRef, useState } from 'react';
import './Section4.css';
import { db, doc, getDoc, setDoc } from '../firebase';  // Correct relative path
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
];

const getTodaysVideo = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return videoFiles[dayOfYear % videoFiles.length];
};

const Section4 = React.forwardRef((props, ref) => {
    const videoSrc = getTodaysVideo();
    const videoRef = useRef(null);
    const buttonRef = useRef(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    useEffect(() => {
        if (videoRef.current) {
            setTimeout(() => {
                videoRef.current.classList.add('fade-in');
            }, 800);

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
            }, 1600);
        }
    }, []);

    const handleButtonClick = async () => {
        try {
            const docRef = doc(db, 'clicks', 'buttonClick');  // Reference to the 'buttonClick' document in 'clicks' collection
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                await setDoc(docRef, { count: data.count + 1 });  // Increment the count
                setClickCount(data.count + 1);
            } else {
                await setDoc(docRef, { count: 1 });  // Initialize the count if the document does not exist
                setClickCount(1);
            }

            setShowOverlay(true);
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    };

    return (
        <div id="section4" className="section" ref={ref}>
            <div className="overlay-v">
                <video ref={videoRef} className="middle-video" controls muted>
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <button
                    ref={buttonRef}
                    className="video-button"
                    onClick={handleButtonClick}
                >
                    GO CHASE YOUR DREAMS
                </button>
            </div>
            {showOverlay && (
                <div className="overlay-window">
                    <div className="overlay-content">
                        <p>Congratulations!</p>
                        <p>You've reached the end of the motivide for today.</p>
                        <p>{clickCount} users have clicked this button today.</p>
                        <button
                            className="close-overlay"
                            onClick={() => setShowOverlay(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
});

export default Section4;
