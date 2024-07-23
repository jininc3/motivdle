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
    const section2Ref = useRef(null);
    const section3Ref = useRef(null);
    const section4Ref = useRef(null);

    useEffect(() => {
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
        if (section2Ref.current) {
            section2Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScrollToSection3 = () => {
        setIsSection3Visible(true);
        if (section3Ref.current) {
            section3Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScrollToSection4 = () => {
        setIsSection4Visible(true);
        if (section4Ref.current) {
            section4Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div>
            <div className="background-home"></div>
            <div className="content">
                <Section1 handleScroll={handleScrollToSection2} />
                <Section2 ref={section2Ref} handleScroll={handleScrollToSection3} />
                <Section3 ref={section3Ref} handleScroll={handleScrollToSection4} />
                <Section4 ref={section4Ref} />
            </div>
        </div>
    );
}

export default Home;
