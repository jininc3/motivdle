import React, { useEffect, useState, useRef } from 'react';
import './Section2.css';
import { db } from '../firebase'; // Ensure this import is correct
import { collection, getDocs, query, where } from 'firebase/firestore';

const Section2 = React.forwardRef(({ handleScroll, onSearchMatch }, ref) => {
  const [quote, setQuote] = useState("");
  const [quoteInfluencer, setQuoteInfluencer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // State to manage play/pause
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      const quotesCollection = collection(db, 'quotes');
      const quoteSnapshot = await getDocs(quotesCollection);
      const quotesList = quoteSnapshot.docs.map(doc => ({
        text: doc.data().quote,
        influencer: doc.data().name,
      }));

      const today = new Date();
      const quoteIndex = today.getDate() % quotesList.length;
      setQuote(`"${quotesList[quoteIndex].text}"`);
      setQuoteInfluencer(quotesList[quoteIndex].influencer);
    };

    fetchQuotes();
  }, []);

  const handleSearchClick = async () => {
    if (searchTerm.length > 0) {
      const quotesCollection = collection(db, 'quotes');
      const q = query(
        quotesCollection,
        where('name', '==', searchTerm.trim().toLowerCase())
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const matchedQuote = querySnapshot.docs[0].data();
        if (matchedQuote.name.toLowerCase() === quoteInfluencer.toLowerCase()) {
          onSearchMatch(quoteInfluencer); // Pass influencer name to parent or directly to Section3
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
      const results = querySnapshot.docs.map(doc => doc.data().name.toUpperCase());
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleAudioToggle = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying); // Toggle the state
    }
  };

  return (
    <div id="section2" className="section" ref={ref}>
      <div className="overlay2">
        <p className="whosays">WHO SAYS THIS QUOTE</p>
        <p className="quotey">{quote}</p>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Type a name..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="search-button" onClick={handleSearchClick}>SEARCH</button>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="suggestion-item" onMouseDown={() => setSearchTerm(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Hint Button */}
        <button className="hint-button" onClick={handleAudioToggle}>
          {isPlaying ? 'STOP AUDIO' : 'AUDIO CLUE'}
        </button>

        {/* Audio Element */}
        <audio ref={audioRef}>
          <source src={require('../assets/audio-bob.mp3')} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
});

export default Section2;
