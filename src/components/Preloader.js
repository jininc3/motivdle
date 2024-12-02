// Preloader.js
import React, { useEffect, useState } from 'react';
import backgroundImage from '../assets/background9.jpg'; // Import the background image

const Preloader = ({ onLoadComplete }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preloadResources = async () => {
      try {
        const videos = [
          'https://storage.googleapis.com/motivdle-videos/video1.mp4',
          'https://storage.googleapis.com/motivdle-videos/video2.mp4',
        ];
        const images = [
          require('../assets/cheetah-logo2.png'),
          require('../assets/details-clue.png'),
          require('../assets/achievements-clue.png'),
        ];

        // Preload images
        const imagePromises = images.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
          });
        });

        // Preload videos
        const videoPromises = videos.map((src) => {
          return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.src = src;
            video.preload = 'auto';
            video.onloadeddata = resolve;
            video.onerror = reject;
          });
        });

        await Promise.all([...imagePromises, ...videoPromises]);
        setLoading(false);
        onLoadComplete();
      } catch (error) {
        console.error('Error loading resources:', error);
        setLoading(false);
        onLoadComplete();
      }
    };

    preloadResources();
  }, [onLoadComplete]);

  return (
    <div
      className={`preloader ${loading ? 'visible' : 'hidden'}`}
      style={{
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        height: '100vh', // Ensure the div covers the viewport
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Background dimming using pseudo-element */}
      <div
        style={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Apply dimming here
          zIndex: 0, // Ensure it sits below the text
        }}
      ></div>
  
      {/* Text */}
      <div
        style={{
          position: 'relative', // Keep it above the background dimming
          
          transform: 'translate(-50%, -50%)',
          zIndex: 1, // Place the text above the dimming
        }}
      >
        <h1 style={{ color: 'white' }}>Loading...</h1>
      </div>
    </div>
  );
  
  
  
};

export default Preloader;
