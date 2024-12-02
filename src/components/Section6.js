import React, { useEffect, useRef, useState } from 'react';
import './Section3.css';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path to your firebase.js file

const Section6 = React.forwardRef(({ influencerName, videoFileName, profileDescription }, ref) => {
    const videoRef = useRef(null);
    const [videoSrc] = useState("");
    const [isVideoLoaded] = useState(false);
    const navigate = useNavigate();
    const [showOverlay, setShowOverlay] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");
    const [finishCount, setFinishCount] = useState(0);

    useEffect(() => {
        // Fetch countdown time
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const msLeft = endOfDay - now;

        setTimeLeft(new Date(msLeft).toISOString().substr(11, 8));

        const interval = setInterval(() => {
            const ms = endOfDay - new Date();
            setTimeLeft(new Date(ms).toISOString().substr(11, 8));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Fetch initial click count from Firestore
        const fetchClickCount = async () => {
            const docRef = doc(db, 'clicks', 'buttonClick');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setFinishCount(docSnap.data().count || 0);
            } else {
                // Initialize the document if it doesn't exist
                await setDoc(docRef, { count: 0, date: new Date().toISOString().split('T')[0] });
                setFinishCount(0);
            }
        };

        fetchClickCount();
    }, []);

    const handleButtonClick = async () => {
        setShowOverlay(true);

        // Update the click count in Firestore
        const docRef = doc(db, 'clicks', 'buttonClick');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const currentCount = docSnap.data().count || 0;
            const newCount = currentCount + 1;

            await updateDoc(docRef, { count: newCount });
            setFinishCount(newCount);
        }
    };

    const handleOverlayClose = () => navigate('/');

    return (
        <div id="section6" className="section3" ref={ref}>
            <div className="overlay-3">
                {isVideoLoaded ? (
                    <video ref={videoRef} className="middle-video3 fade-in" controls preload="auto">
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <p>Loading video...</p>
                )}
                <div className="text-content3">
                    <h1 className="congratulations-title3">
                        <span className="congratulations-text3">CONGRATULATIONS!</span>
                        <br />
                        THIS QUOTE IS FROM <span className="influencer-name3">{influencerName}</span>
                    </h1>
                    <p className="video-description3">
    {profileDescription || `This video showcases a powerful quote from ${influencerName}. It is intended to inspire and motivate viewers to take action and push themselves beyond their limits.`}
</p>
                    <button
                        className="video-button3 fade-in"
                        onClick={handleButtonClick}
                    >
                        FINISH GAME
                    </button>
                </div>
            </div>
            {showOverlay && (
                <div className="finish-overlay">
                    <h2>Congratulations on finishing today's Motivdle!</h2>
                    <p>
                        Time left until the next Motivdle: <span className="highlight">{timeLeft}</span>
                    </p>
                    <p>
                        Number of participants who finished today: <span className="highlight">{finishCount}</span>
                    </p>
                    <button className="overlay-close" onClick={handleOverlayClose}>
                        Close
                    </button>
                </div>
            )}
        </div>
    );
});

export default Section6;
