import React, { useEffect, useRef, useState } from 'react';
import './Section3.css'; // Ensure the correct CSS file is imported
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure your Firebase config is imported

const Section5 = React.forwardRef(({ videoFileName }, ref) => {
    const videoRef = useRef(null);
    const buttonRef = useRef(null);
    const [videoSrc, setVideoSrc] = useState("");
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [influencerName, setInfluencerName] = useState(''); // Fetch this from the actual quote document
    const navigate = useNavigate();

    const preloadVideo = async (url) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.src = url;
            video.preload = 'auto';

            video.onloadeddata = () => {
                console.log('Video preloaded successfully:', url);
                resolve(url);
            };

            video.onerror = () => {
                console.error('Error preloading video:', url);
                reject(new Error('Error preloading video'));
            };
        });
    };

    useEffect(() => {
        if (videoFileName) {
            const videoUrl = `https://storage.googleapis.com/motivdle-videos/${videoFileName}`;
            preloadVideo(videoUrl)
                .then((url) => {
                    setVideoSrc(url);
                    setIsVideoLoaded(true);
                    if (videoRef.current) {
                        videoRef.current.classList.add('fade-in');
                    }
                })
                .catch((error) => {
                    console.error('Failed to preload video:', error);
                    setIsVideoLoaded(false);
                });
        }
    }, [videoFileName]);

    useEffect(() => {
        const fetchQuoteOfTheDay = async () => {
            try {
                // First, get the quoteOfTheDay2 document to retrieve quoteId2
                const quoteOfTheDayDoc = await getDoc(doc(db, 'quoteOTD2', 'quoteOfTheDay2'));

                if (quoteOfTheDayDoc.exists()) {
                    const quoteId2 = quoteOfTheDayDoc.data().quoteId2;

                    // Fetch the actual quote document using quoteId2
                    const quoteDoc = await getDoc(doc(db, 'quotes', quoteId2));
                    if (quoteDoc.exists()) {
                        const quoteData = quoteDoc.data();
                        setInfluencerName(quoteData.name); // Set the name from the actual quote
                    } else {
                        console.error('Quote not found in quotes collection');
                    }
                } else {
                    console.error('Quote of the day not found');
                }
            } catch (error) {
                console.error('Error fetching quote of the day:', error);
            }
        };

        fetchQuoteOfTheDay();
    }, []); // This will run only once when the component mounts

    const handleButtonClick = async () => {
        navigate('/section4'); // Adjust this navigation to fit your flow
    };

    return (
        <div id="section5" className="section3" ref={ref}>
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
                        This video showcases a powerful quote from <span className="caps">{influencerName}</span>. It is intended to inspire and motivate viewers to take action and push themselves beyond their limits. Watch the video and feel the power of positive words in action.
                    </p>
                    <button
                        ref={buttonRef}
                        className="video-button3 fade-in"
                        onClick={handleButtonClick}
                    >
                        ROUND 3 - MOVIE
                    </button>
                </div>
            </div>
        </div>
    );
});

export default Section5;
