import React, { useEffect, useState, useRef } from 'react';
import './Section2.css';
import { db } from '../firebase'; // Import the Firestore instance
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

const Section2 = React.forwardRef(({ handleScroll }, ref) => {
  const [quote, setQuote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const quoteyRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      const quotesCollection = collection(db, 'quotes');
      const quoteSnapshot = await getDocs(quotesCollection);
      const quotesList = quoteSnapshot.docs.map(doc => doc.data().text);
      
      const today = new Date();
      const quoteIndex = today.getDate() % quotesList.length;
      setQuote(quotesList[quoteIndex]);
    };

    fetchQuotes();

    if (quoteyRef.current) {
      setTimeout(() => {
        quoteyRef.current.classList.add('fade-in');
      }, 800);
    }

    if (buttonRef.current) {
      setTimeout(() => {
        buttonRef.current.classList.add('fade-in');
      }, 1000);
    }
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const influencersRef = collection(db, 'influencers');
      const q = query(influencersRef, where('name', '>=', value), where('name', '<=', value + '\uf8ff'), limit(10));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => doc.data().name);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div id="section2" className="section" ref={ref}>
      <div className="overlay2">
        <p className="whosays">WHO SAYS THIS QUOTE</p>
        <p ref={quoteyRef} className="quotey fade-in-element">{quote}</p>
        <div className="search-bar-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Type a name..." 
            value={searchTerm} 
            onChange={handleSearch} 
          />
          <button className="search-button">Search</button>
        </div>
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="suggestion-item">{suggestion}</li>
            ))}
          </ul>
        )}
      </div>
      <button ref={buttonRef} className="quote-button2" id="transitionButton" onClick={handleScroll}>MOTIVATIONAL IMAGE</button>
    </div>
  );
});

export default Section2;
