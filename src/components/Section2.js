import React, { useEffect, useState, useRef } from 'react';
import './Section2.css';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc, setDoc, } from 'firebase/firestore';
import TextLogo from './TextLogo';

const Section2 = React.forwardRef(({ handleScroll, onSearchMatch }, ref) => {
  const [quote, setQuote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [hint1, setHint1] = useState("");
  const [showHint1, setShowHint1] = useState(false);
  const [hint2, setHint2] = useState("");
  const [showHint2, setShowHint2] = useState(false);
  const [quoteInfluencer, setQuoteInfluencer] = useState(""); // Define state for the influencer
  const [videoFile, setVideoFile] = useState(""); // Define state for the video file
  const audioRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const fetchQuoteOfTheDay = async () => {
      const today = new Date();
      const currentDay = today.toDateString(); // Convert current date to a string
  
      // Check Firestore for today's quote in the quoteOfTheDay collection
      const quoteOfTheDayDoc = await getDoc(doc(db, 'quoteOTD', 'quoteOfTheDay'));
  
      if (quoteOfTheDayDoc.exists() && quoteOfTheDayDoc.data().date === currentDay) {
        // If today's quote exists, use the quote data directly from quoteOfTheDay
        const dailyQuote = quoteOfTheDayDoc.data();
        setQuote(`"${dailyQuote.quote}"`);
        setQuoteInfluencer(dailyQuote.name); // Store the name from Firestore
        setHint1(dailyQuote.hint1);
        setHint2(dailyQuote.hint2);
        setAudioFile(dailyQuote.audio);
        setVideoFile(dailyQuote.video);
  
        console.log("Quote of the Day:", dailyQuote.quote);
      } else {
        // Pick a new random quote from the quotes collection and set it as today's quote
        const quotesCollection = collection(db, 'quotes');
        const quoteSnapshot = await getDocs(quotesCollection);
        const quotesList = quoteSnapshot.docs.filter(doc => doc.id !== 'quoteOfTheDay');
  
        // Randomly select a quote from the pool
        const randomIndex = Math.floor(Math.random() * quotesList.length);
        const selectedQuote = quotesList[randomIndex].data();
  
        // Set the new quote in the state
        setQuote(`"${selectedQuote.quote}"`);
        setQuoteInfluencer(selectedQuote.name);
        setHint1(selectedQuote.hint1);
        setHint2(selectedQuote.hint2);
        setAudioFile(selectedQuote.audio);
        setVideoFile(selectedQuote.video);
  
        // Store all quote data in the quoteOfTheDay document for future reference
        await setDoc(doc(db, 'quoteOTD', 'quoteOfTheDay'), {
          ...selectedQuote, // Store all fields from the selected quote
          date: currentDay  // Store today's date
        });
  
        console.log("New Quote of the Day:", selectedQuote.quote);
      }
    };
  
    fetchQuoteOfTheDay();
  }, []);
  
  
  const handleSearchClick = async () => {
    // Always use the trimmed and lower-cased search term for comparison
    const guessedName = inputRef.current.value.trim().toLowerCase();
  
    if (incorrectGuesses.map(guess => guess.toLowerCase()).includes(guessedName)) {
      alert("You have already guessed this name. Try a different one.");
      return;
    }
  
    if (guessedName.length > 0) {
      // Fetch the quoteOfTheDay document to get the current name
      const quoteOfTheDayDoc = await getDoc(doc(db, 'quoteOTD', 'quoteOfTheDay'));
  
      if (quoteOfTheDayDoc.exists()) {
        const dailyQuote = quoteOfTheDayDoc.data();
        const quoteInfluencerName = dailyQuote.name.toLowerCase();
  
        // Compare the guessed name (now from the selected suggestion) with the name from quoteOfTheDay
        if (guessedName === quoteInfluencerName) {
          // If it matches, scroll to section3
          onSearchMatch(dailyQuote.name, dailyQuote.video);
        } else {
          // If it doesn't match, log an incorrect guess
          setIncorrectGuesses(prev => [...prev.slice(-4), guessedName]);
          setGuessCount(guessCount + 1);
        }
      } else {
        console.error('Quote of the day not found');
      }
  
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
      const lowerCaseValue = value.toLowerCase();
      const quotesCollection = collection(db, 'quotes');
      const q = query(
        quotesCollection,
        where('name', '>=', lowerCaseValue),
        where('name', '<=', lowerCaseValue + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({
        name: doc.data().name,
        icon: doc.data().icon,
      })).filter(suggestion => suggestion.name.toLowerCase().includes(lowerCaseValue));

      setSuggestions(results);
      setShowSuggestions(true);
      setHighlightedIndex(-1); // Reset the highlighted index when new suggestions are shown
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' && showSuggestions) {
      setHighlightedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp' && showSuggestions) {
      setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (e.key === 'Enter') {
      if (showSuggestions && highlightedIndex >= 0) {
        // Select the highlighted suggestion and trigger the search immediately
        const selectedSuggestion = suggestions[highlightedIndex].name;
        setSearchTerm(selectedSuggestion);
        inputRef.current.value = selectedSuggestion; // Manually set the input field value
        setShowSuggestions(false);
        handleSearchClick(); // Trigger the search function
      } else {
        // If no suggestions are shown, just run the search
        handleSearchClick();
      }
    }
  };
  

  const handleAudioToggle = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        console.log("Audio paused");
      } else {
        audioRef.current.play().then(() => {
          console.log("Audio playing");
        }).catch(error => {
          console.error("Audio failed to play:", error);
        });
      }
      setIsPlaying(!isPlaying);
    } else {
      console.error("Audio reference not set");
    }
  };

  const toggleHint1 = () => {
    setShowHint1(!showHint1);
    if (showHint2) setShowHint2(false);
  };

  const toggleHint2 = () => {
    setShowHint2(!showHint2);
    if (showHint1) setShowHint1(false);
  };

  return (
    <div id="section2" className="section" ref={ref}>
      < TextLogo />
      <div className="overlay2">
        <p className="whosays">
          Guess Who Says This Quote?
          <br />
          <span className="rounds" style={{ marginTop: '-10px' }}>(ROUND 1)</span>
        </p>
        <p className="quotey"><span className="thequote">{quote}</span></p>

        <div className="search-bar-container">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Type a name..."
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown} // Add keydown listener
          />
          <button className="search-button" onClick={handleSearchClick}>
            <img src={require('../assets/search.png')} alt="Search" className="search-icon" />
          </button>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list2">
              {suggestions.map((suggestion, index) => (
              <li
              key={index}
              className={`suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              onMouseDown={() => {
                const selectedSuggestion = suggestion.name;
                setSearchTerm(selectedSuggestion); // Set the search term to the selected suggestion
                inputRef.current.value = selectedSuggestion; // Update the input field manually
                setShowSuggestions(false); // Hide the suggestion list
                handleSearchClick(); // Trigger the search for the selected suggestion
              }}
            >
              <img
                className="suggestion-image"
                src={`https://storage.googleapis.com/motivdle-images/${suggestion.icon}`}
                alt={suggestion.name}
              />
              {suggestion.name}
            </li>
             
              ))}
            </ul>
          )}
        </div>
        <p className="guess-tracker">You have made <span className='guess-number'>{guessCount}</span> guesses</p>
        <div className="button-container">
          <button className="hint-button" onClick={toggleHint1} data-tooltip="Character Clue">
            <img className="icons" src={require('../assets/details-clue.png')} alt="Character Clue" />
          </button>

          <button className="hint-button" onClick={toggleHint2} data-tooltip="Achievements Clue">
            <img className="icons" src={require('../assets/achievements-clue.png')} alt="Achievements Clue" />
          </button>

          <button className="audio-button" onClick={handleAudioToggle} data-tooltip="Audio Clue">
            <img className="icons" src={require('../assets/audio-clue.png')} alt="Audio Clue" />
          </button>
        </div>

        <div className="hint-container">
          {showHint1 && (
            <div className="hint-bubble">{hint1}</div>
          )}

          {showHint2 && (
            <div className="hint-bubble">{hint2}</div>
          )}
        </div>

        <div className="incorrect-guesses">
          {incorrectGuesses.map((guess, index) => (
            <p key={index} className="incorrect-guess-text">{guess.toUpperCase()}</p>
          ))}
        </div>

        {audioFile && (
          <audio ref={audioRef}>
            <source
              src={`https://storage.googleapis.com/motivdle-audio/${audioFile}`}
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </audio>
        )}
        {/* Invisible quoteInfluencer and videoFile */}
      <div style={{ display: 'none' }}>
        <p>{quoteInfluencer}</p>
        <video src={videoFile} controls />
        </div>
      </div>
    </div>
  );
});

export default Section2;