import React, { useState, useEffect, useRef } from 'react';
import './Home2.css';
import Section4 from './Section4';
import Section5 from './Section5';
import TextLogo from './TextLogo';

function Home2() {
    const [isSection4Visible, setIsSection4Visible] = useState(true);
    const [isSection5Visible, setIsSection5Visible] = useState(false);
    const [influencerName, setInfluencerName] = useState("");
    const [videoFile, setVideoFile] = useState("");
    const section4Ref = useRef(null);
    const section5Ref = useRef(null);

    useEffect(() => {
        if (isSection4Visible && section4Ref.current) {
            section4Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSection4Visible]);

    useEffect(() => {
        if (isSection5Visible && section5Ref.current) {
            section5Ref.current.scrollIntoView({ behavior: 'smooth' });
            
        } else if (!isSection5Visible) {
            
        }
    }, [isSection5Visible]);



    

    const handleSearchMatch = (name, videoFileName) => {
        setInfluencerName(name);
        setVideoFile(videoFileName);
        setIsSection4Visible(false); 
        setIsSection5Visible(true); 
    };

    return (
        <div>
            <TextLogo />
            <div className="background-home"></div>
            {isSection4Visible && (
                <Section4
                    ref={section4Ref}
                    onSearchMatch={handleSearchMatch}
                />
            )}
            {isSection5Visible && (
                <Section5
                    ref={section5Ref}
                    influencerName={influencerName}
                    videoFileName={videoFile}
                />
            )}
        </div>
    );
}

export default Home2;
