import React, { useEffect, useRef, useState } from 'react';
import './Section3.css'; // Reuse Section3.css for styling
import { useNavigate } from 'react-router-dom';


const Section5 = React.forwardRef(({ influencerName, videoFileName, backgroundStyle }, ref) => {
    const videoRef = useRef(null);
    const buttonRef = useRef(null);
    const [videoSrc, setVideoSrc] = useState("");
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
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
                    setTimeout(() => {
                        if (videoRef.current) {
                            videoRef.current.play();
                        }
                    }, 1000); // 1 second delay
                })
                .catch((error) => {
                    console.error('Failed to preload video:', error);
                    setIsVideoLoaded(false);
                });
        }
    }, [videoFileName]);

    const handleButtonClick = async () => {
        navigate('/home3'); // Navigate to the appropriate route after the video
    };

    return (
        <div id="section5" className="section3" ref={ref} style={backgroundStyle}>
            <div className="overlay-3">
                {isVideoLoaded ? (
                    <video ref={videoRef} className="middle-video3 fade-in" controls preload="auto" >
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
                        This video showcases a powerful quote from {influencerName}. It is intended to inspire and motivate viewers to take action and push themselves beyond their limits. Watch the video and feel the power of positive words in action.
                    </p>
                    <button
                        ref={buttonRef}
                        className="video-button3 fade-in"
                        onClick={handleButtonClick}
                    >
                        PRESS FOR ROUND 3
                    </button>
                </div>
            </div>
        </div>
    );
});

export default Section5;
