import React, { useEffect, useState, useRef } from 'react';
import './Section2.css';
import { db } from '../firebase'; // Ensure this import is correct
import { collection, getDocs, query, where } from 'firebase/firestore';

const Section2 = React.forwardRef(({ handleScroll, onSearchMatch }, ref) => {
  const [quote, setQuote] = useState("");
  const [quoteInfluencer, setQuoteInfluencer] = useState(""); // State for the influencer of the displayed quote
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const quoteyRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      const quotesCollection = collection(db, 'quotes');
      const quoteSnapshot = await getDocs(quotesCollection);
      const quotesList = quoteSnapshot.docs.map(doc => ({
        text: doc.data().quote,
        influencer: doc.data().name, // Assuming each quote document has 'quote' and 'name' fields
      }));

      const today = new Date();
      const quoteIndex = today.getDate() % quotesList.length;
      setQuote(`"${quotesList[quoteIndex].text}"`); // Add quotation marks here
      setQuoteInfluencer(quotesList[quoteIndex].influencer); // Set the corresponding influencer
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
      const quotesCollection = collection(db, 'quotes');
      const q = query(
        quotesCollection, 
        where('name', '>=', value), 
        where('name', '<=', value + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => doc.data().name.toUpperCase()); // Convert names to uppercase
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchClick = async () => {
    if (searchTerm.length > 0) {
      const quotesCollection = collection(db, 'quotes');
      const q = query(
        quotesCollection,
        where('name', '==', searchTerm.trim().toLowerCase()) // Ensure exact match by trimming and converting to lowercase
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const matchedQuote = querySnapshot.docs[0].data();
        if (matchedQuote.name.toLowerCase() === quoteInfluencer.toLowerCase()) {
          // Trigger the scroll behavior to Section 3
          onSearchMatch();
        } else {
          alert('The input does not match the name of the influencer associated with the quote.');
        }
      } else {
        alert('The input does not match any known influencer.');
      }
    } else {
      alert('Please enter a name in the search bar.');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
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
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delay to allow click
            onFocus={() => setShowSuggestions(true)} // Show suggestions on focus
          />
          <button 
            className="search-button"
            onClick={handleSearchClick} // Trigger check on search button click
          >
            Search
          </button>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index} 
                  className="suggestion-item" 
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
    </div>
  );
});

export default Section2;
