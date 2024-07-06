import React, { useState, useEffect, useRef } from 'react';
import './Test.css';
import Section1 from './Section1';
import Section2 from './Section2';

function Test() {
  const [isSection2Visible, setIsSection2Visible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const section2Ref = useRef(null);

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isSection2Visible) {
      section2Ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isSection2Visible]);

  const handleScroll = () => {
    setIsSection2Visible(true);
    setIsButtonVisible(false); // Hide the button once clicked
  };

  return (
    <div>
      <div className="background-test"></div>
      <div className="content">
        <Section1 handleScroll={handleScroll} isButtonVisible={isButtonVisible} />
        {isSection2Visible && <Section2 ref={section2Ref} />}
      </div>
    </div>
  );
}

export default Test;
