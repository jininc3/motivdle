import React, { useEffect, useState, useRef } from 'react';
import './Section2.css';

const quotes = [
  "\"Dreams don't work unless you do.\" - John C. Maxwell",
  "\"The only way to do great work is to love what you do.\" - Steve Jobs",
  "\"The future belongs to those who believe in the beauty of their dreams.\" - Eleanor Roosevelt",
  "\"Don't watch the clock; do what it does. Keep going.\" - Sam Levenson",
  "\"Keep your face always toward the sunshine—and shadows will fall behind you.\" - Walt Whitman",
  "\"The best way to predict the future is to create it.\" - Peter Drucker",
  "\"Your time is limited, don't waste it living someone else's life.\" - Steve Jobs"
];

const Section2 = React.forwardRef(({ handleScroll }, ref) => {
  const [quote, setQuote] = useState("");
  const quoteyRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    const quoteIndex = today.getDate() % quotes.length;
    setQuote(quotes[quoteIndex]);

    if (quoteyRef.current) {
      setTimeout(() => {
        quoteyRef.current.classList.add('fade-in');
      }, 800); // Adjust the delay as needed
    }

    if (buttonRef.current) {
      setTimeout(() => {
        buttonRef.current.classList.add('fade-in');
      }, 1000); // Adjust the delay as needed
    }
  }, []);

  return (
    <div id="section2" className="section" ref={ref}>
      <div className="overlay2">
        <p ref={quoteyRef} className="quotey fade-in-element">{quote}</p>
      </div>
      <button ref={buttonRef} className="quote-button2" id="transitionButton" onClick={handleScroll}>Motivational Image</button>
    </div>
  );
});

export default Section2;
