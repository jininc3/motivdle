// src/Home.js
import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';

function Home() {
    const [isSection2Visible, setIsSection2Visible] = useState(false);
    const [isSection3Visible, setIsSection3Visible] = useState(false);
    const [isSection4Visible, setIsSection4Visible] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const section2Ref = useRef(null);
    const section3Ref = useRef(null);
    const section4Ref = useRef(null);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);

    }, []);

    useEffect(() => {
        if (isSection2Visible) {
            section2Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSection2Visible]);

    useEffect(() => {
        if (isSection3Visible) {
            section3Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSection3Visible]);

    useEffect(() => {
        if (isSection4Visible) {
            section4Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSection4Visible]);

    const handleScrollToSection2 = () => {
        setIsSection2Visible(true);
        setIsButtonVisible(false); // Hide the button once clicked
    };

    const handleScrollToSection3 = () => {
        setIsSection3Visible(true);
    };

    const handleScrollToSection4 = () => {
        setIsSection4Visible(true);
    };

  

    return (
        <div>
            <div className="background-home"></div>
            <div className="content">
                <Section1 handleScroll={handleScrollToSection2} isButtonVisible={isButtonVisible} />
                {isSection2Visible && <Section2 ref={section2Ref} handleScroll={handleScrollToSection3} />}
                {isSection3Visible && <Section3 ref={section3Ref} handleScroll={handleScrollToSection4} />}
                {isSection4Visible && <Section4 ref={section4Ref} />}
            </div>
        </div>
    );
}

export default Home;
