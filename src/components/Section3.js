import React, { useEffect, useRef, useState } from 'react';
import './Section3.css';
import { db, doc, getDoc, setDoc } from '../firebase'; 

const calculateTimeLeft = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set the time to midnight
    const difference = midnight - now;
  
    const hours = String(Math.floor(difference / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0');
  
    return { hours, minutes, seconds };
  };

const Section3 = React.forwardRef(({ videoFileName, influencerName }, ref) => {
    const videoRef = useRef(null);
    const buttonRef = useRef(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [videoSrc, setVideoSrc] = useState(""); // New state for video source URL




    useEffect(() => {
        const fetchVideo = async () => {
            const videoUrl = `https://storage.googleapis.com/motivdle-videos/${videoFileName}`;
            setVideoSrc(videoUrl); // Set the dynamically fetched video URL
        };

        fetchVideo();

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
    }, [videoFileName]); // Depend on videoFileName to ensure it updates properly

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
        <div id="section3" className="section" ref={ref}>
            <div className="overlay-v">
                <h1 className="congratulations-title">
                    <span className="congratulations-text">CONGRATULATIONS!</span>
                    <br />
                    THIS QUOTE IS FROM <span className="influencer-name">{influencerName}</span>
                </h1>
                <video ref={videoRef} className="middle-video" controls>
                    {/* Dynamically set video src */}
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
                        <p>You are one of <span className="number-highlight">{clickCount}</span> users who have motivated themselves today.</p>
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

export default Section3;
