// Preloader.js
import React, { useEffect, useState } from 'react';
import backgroundImage from '../assets/background200.png'; // Import the background image

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
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
    >
      <h1>Loading...</h1>
    </div>
  );
};

export default Preloader;
