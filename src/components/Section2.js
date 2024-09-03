import React, { useEffect, useState, useRef } from 'react';
import './Section2.css';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Section2 = React.forwardRef(({ handleScroll, onSearchMatch }, ref) => {
  const [quote, setQuote] = useState("");
  const [quoteInfluencer, setQuoteInfluencer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guessCount, setGuessCount] = useState(0); // Track number of guesses
  const [incorrectGuesses, setIncorrectGuesses] = useState([]); // Track incorrect guesses
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
    if (guessCount >= 5) {
      alert("You've reached the maximum number of guesses.");
      return;
    }

    const guessedName = searchTerm.trim().toLowerCase();

    // Check if the name has already been guessed
    if (incorrectGuesses.map(guess => guess.toLowerCase()).includes(guessedName)) {
      alert("You have already guessed this name. Try a different one.");
      return;
    }

    if (searchTerm.length > 0) {
      const quotesCollection = collection(db, 'quotes');
      const q = query(
        quotesCollection,
        where('name', '==', guessedName)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const matchedQuote = querySnapshot.docs[0].data();
        if (matchedQuote.name.toLowerCase() === quoteInfluencer.toLowerCase()) {
          onSearchMatch(quoteInfluencer); // Correct match
        } else {
          setIncorrectGuesses([...incorrectGuesses, searchTerm.trim()]); // Add to incorrect guesses
          setGuessCount(guessCount + 1); // Increment guess count

          // Remove the guessed name from suggestions if it's incorrect
          const updatedSuggestions = suggestions.filter(
            (suggestion) => suggestion.toLowerCase() !== guessedName
          );
          setSuggestions(updatedSuggestions);
        }
      } else {
        setIncorrectGuesses([...incorrectGuesses, searchTerm.trim()]);
        setGuessCount(guessCount + 1);

        // Remove the guessed name from suggestions if it's incorrect
        const updatedSuggestions = suggestions.filter(
          (suggestion) => suggestion.toLowerCase() !== guessedName
        );
        setSuggestions(updatedSuggestions);
      }

      // Reset search term after search
      setSearchTerm(""); 
      setShowSuggestions(false);
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
      setIsPlaying(!isPlaying);
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
        <p className="guess-tracker">Guesses: {guessCount} / 5</p>
        {/* Hint Button */}
        <button className="hint-button" onClick={handleAudioToggle}>
          {isPlaying ? 'STOP AUDIO' : 'AUDIO CLUE'}
        </button>

        {/* Incorrect Guesses Display */}
        <div className="incorrect-guesses">
          {incorrectGuesses.map((guess, index) => (
            <p key={index} className="incorrect-guess-text">{guess.toUpperCase()}</p>
          ))}
        </div>

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
