import React, { useEffect, useState } from 'react';
import './Section4.css';
import { Link } from 'react-router-dom';
import video1 from '../assets/video1.mp4';
import video2 from '../assets/video2.mp4';
import video3 from '../assets/video3.mp4';
import video4 from '../assets/video4.mp4';

const videos = [video1, video2, video3, video4];

const Section4 = React.forwardRef((props, ref) => {
  const [video, setVideo] = useState("");

  useEffect(() => {
    const today = new Date();
    const videoIndex = today.getDate() % videos.length;
    setVideo(videos[videoIndex]);
  }, []);

  return (
    <div id="section4" className="section" ref={ref}>
      <div className="overlay-v">
        <video className="middle-video" controls>
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Link to="/comment">
          <button className="video-button">Go chase your dreams</button>
        </Link>
      </div>
    </div>
  );
});

export default Section4;
