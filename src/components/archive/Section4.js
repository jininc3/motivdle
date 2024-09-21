// src/components/Section4.js
import React, { useEffect, useRef, useState } from 'react';
import './Section3.css';
import { db, doc, getDoc, setDoc } from '../firebase';  // Correct relative path
import video1 from '../assets/video2.mp4';
import video2 from '../assets/video3.mp4';
import video3 from '../assets/video4.mp4';
import video4 from '../assets/video5.mp4';
import video5 from '../assets/video6.mp4';
import video6 from '../assets/video7.mp4';
import video7 from '../assets/video8.mp4';
import video8 from '../assets/video10.mp4';

const videoFiles = [
    video1,
    video2,
    video3,
    video4,
    video5,
    video6,
    video7,
    video8,
];

const getTodaysVideo = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return videoFiles[dayOfYear % videoFiles.length];
};

const calculateTimeLeft = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const difference = midnight - now;

    const hours = String(Math.floor(difference / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0');

    return { hours, minutes, seconds };
};

const Section4 = React.forwardRef((props, ref) => {
    const videoSrc = getTodaysVideo();
    const videoRef = useRef(null);
    const buttonRef = useRef(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const fetchClickCount = async () => {
            const docRef = doc(db, 'clicks', 'buttonClick');
            const docSnap = await getDoc(docRef);

            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.date === today) {
                    setClickCount(data.count);
                } else {
                    await setDoc(docRef, { count: 0, date: today }); // Reset count for new day
                    setClickCount(0);
                }
            } else {
                await setDoc(docRef, { count: 0, date: today }); // Initialize if document does not exist
                setClickCount(0);
            }
        };

        fetchClickCount();

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

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000); // Update every second

        return () => clearInterval(timer);
    }, []);

    const handleButtonClick = async () => {
        try {
            const docRef = doc(db, 'clicks', 'buttonClick');
            const docSnap = await getDoc(docRef);
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.date === today) {
                    await setDoc(docRef, { count: data.count + 1, date: today });
                    setClickCount(data.count + 1);
                } else {
                    await setDoc(docRef, { count: 1, date: today }); // Reset count for new day
                    setClickCount(1);
                }
            } else {
                await setDoc(docRef, { count: 1, date: today }); // Initialize if document does not exist
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
                <video ref={videoRef} className="middle-video" controls autoPlay muted>
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
                        <p><strong>CONGRATULATIONS</strong></p>
                        <p>This is the end of today's motivdle.</p> <br></br>
                        <p>You are of <span className="number-highlight">{clickCount}</span> users who have motivated themselves today.</p>
<p>Time left till the next motivdle: <span className="timer-highlight">{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</span></p>
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
