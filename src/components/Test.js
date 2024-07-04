import React, { useState, useEffect, useRef } from 'react';
import './Test.css';

function Test() {
  const [isSection2Visible, setIsSection2Visible] = useState(false);
  const section2Ref = useRef(null);

  useEffect(() => {
    if (isSection2Visible) {
      section2Ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isSection2Visible]);

  const handleScroll = () => {
    setIsSection2Visible(true);
  };

  return (
    <div>
      <button id="scrollButton" onClick={handleScroll}>Scroll to Section 2</button>
      <div id="section1" className="section">Section 1 Content</div>
      {isSection2Visible && (
        <div id="section2" className="section" ref={section2Ref}>Section 2 Content</div>
      )}
    </div>
  );
}

export default Test;
