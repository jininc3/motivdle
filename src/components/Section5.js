import React, { useEffect, useRef, useState } from 'react';
import './Section5.css';
import { useNavigate } from 'react-router-dom';




const Section5 = React.forwardRef(({ influencerName, videoFileName }, ref) => {
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
                })
                .catch((error) => {
                    console.error('Failed to preload video:', error);
                    setIsVideoLoaded(false);
                });
        }
    }, [videoFileName]);




    const handleButtonClick = async () => {
       
            navigate('/section6'); // Navigate to the next section or end page
       
    };

    return (
        <div id="section5" className="section5" ref={ref}>
            <div className="overlay-v">
                {isVideoLoaded ? (
                    <video ref={videoRef} className="middle-video fade-in" controls preload="auto">
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <p>Loading video...</p>
                )}
                <div className="text-content">
                    <h1 className="congratulations-title">
                        <span className="congratulations-text">CONGRATULATIONS!</span>
                        <br />
                        THIS QUOTE IS FROM <span className="influencer-name">{influencerName}</span>
                    </h1>
                    <p className="video-description">
                        This video showcases a powerful quote from {influencerName}. It is intended to inspire and motivate viewers to take action and push themselves beyond their limits. Watch the video and feel the power of positive words in action.
                    </p>
                    <button
                        ref={buttonRef}
                        className="video-button fade-in"
                        onClick={handleButtonClick}
                    >
                        PRESS FOR ROUND 2
                    </button>
                </div>
            </div>
          
        </div>
    );
});

export default Section5;
