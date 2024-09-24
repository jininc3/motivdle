import React, { useState, useEffect, useRef } from 'react';
import './Home2.css'; // Create and style this file similarly to Home.css
import Section4 from './Section4';
import Section5 from './Section5';
import TextLogo from './TextLogo';

function Home2() {
    const [isSection4Visible, setIsSection4Visible] = useState(true);
    const [isSection5Visible, setIsSection5Visible] = useState(false);
    const section4Ref = useRef(null);
    const section5Ref = useRef(null);

    // Scroll to Section4 when triggered
    useEffect(() => {
        if (isSection4Visible && section4Ref.current) {
            section4Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSection4Visible]);

    // Show Section5 when the correct answer is given
    useEffect(() => {
        if (isSection5Visible && section5Ref.current) {
            section5Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSection5Visible]);

    const handleSearchMatch = (name, videoFileName) => {
        setIsSection4Visible(false); // Hide Section4
        setIsSection5Visible(true); // Show Section5
    };

    return (
        <div>
            <TextLogo />
             <div className="background-home"></div>
            {isSection4Visible && (
                <Section4
                    ref={section4Ref}
                    onSearchMatch={handleSearchMatch} // Pass the handler for correct guess
                />
            )}

            {isSection5Visible && (
                <Section5
                    ref={section5Ref}
                />
            )}
        </div>
    );
}

export default Home2;
