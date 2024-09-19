import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';

function Home() {
    const [isSection2Visible, setIsSection2Visible] = useState(false);
    const [isSection3Visible, setIsSection3Visible] = useState(false);
    const [influencerName, setInfluencerName] = useState("");
    const [videoFile, setVideoFile] = useState("");
    
    const section2Ref = useRef(null);
    const section3Ref = useRef(null);

    // Scroll to Section2 when "MOTIVDLE GAME" is clicked
    useEffect(() => {
        if (isSection2Visible && section2Ref.current) {
            section2Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSection2Visible]);

    // Scroll to Section3 after the correct answer is given
    useEffect(() => {
        if (isSection3Visible && section3Ref.current) {
            section3Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSection3Visible]);

    const handleScrollToSection2 = () => {
        setIsSection2Visible(true); // Show Section2 and trigger scroll in useEffect
    };

    const handleSearchTriggerScroll = (name, videoFileName) => {
        setInfluencerName(name);
        setVideoFile(videoFileName);
        setIsSection3Visible(true); // Show Section3 and trigger scroll in useEffect
    };

    return (
        <div>
            <div className="background-home"></div>
            <div className="content">
                <Section1 handleScroll={handleScrollToSection2} />
                
                {isSection2Visible && (
                    <Section2
                        ref={section2Ref}
                        onSearchMatch={handleSearchTriggerScroll} // Pass the handler for correct guess
                    />
                )}

                {isSection3Visible && (
                    <Section3
                        ref={section3Ref}
                        influencerName={influencerName}
                        videoFileName={videoFile}
                    />
                )}
            </div>
        </div>
    );
}

export default Home;