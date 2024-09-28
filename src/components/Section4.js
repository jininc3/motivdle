
import React, { useEffect, useState, useRef } from 'react';
import './Section4.css';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Section2 = React.forwardRef(({ handleScroll, onSearchMatch }, ref) => {
  const [quote, setQuote] = useState("");
  const [quoteInfluencer, setQuoteInfluencer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Track highlighted suggestion
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [hint1, setHint1] = useState("");
  const [showHint1, setShowHint1] = useState(false);
  const [hint2, setHint2] = useState("");
  const [showHint2, setShowHint2] = useState(false);
  const audioRef = useRef(null);
  const [videoFile, setVideoFile] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const fetchQuotes = async () => {
      const quotesCollection = collection(db, 'quotes');
      const quoteSnapshot = await getDocs(quotesCollection);
      const quotesList = quoteSnapshot.docs.map(doc => ({
        text: doc.data().quote,
        influencer: doc.data().name,
        icon: doc.data().icon,
        hint1: doc.data().hint1,
        hint2: doc.data().hint2,
        audio: doc.data().audio,
        video: doc.data().video,
      }));

      const today = new Date();
      
      const excludedIndex = today.getDate() % quotesList.length; // This index is used in Section2.js
      const newIndex = (excludedIndex + 1) % quotesList.length;

      setQuote(`"${quotesList[newIndex].text}"`);
      setQuoteInfluencer(quotesList[newIndex].influencer);
      setHint1(quotesList[newIndex].hint1);
      setHint2(quotesList[newIndex].hint2);
      setAudioFile(quotesList[newIndex].audio);
      setVideoFile(quotesList[newIndex].video);
    };

    fetchQuotes();
  }, []);

  const handleSearchClick = async () => {
    const guessedName = searchTerm.trim().toLowerCase();

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
          onSearchMatch(quoteInfluencer, videoFile);
        } else {
          setIncorrectGuesses(prev => [...prev.slice(-4), searchTerm.trim()]);
          setGuessCount(guessCount + 1);
        }
      } else {
        setIncorrectGuesses(prev => [...prev.slice(-4), searchTerm.trim()]);
        setGuessCount(guessCount + 1);
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
      // Move highlight down
      setHighlightedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp' && showSuggestions) {
      // Move highlight up
      setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (e.key === 'Enter' && showSuggestions && highlightedIndex >= 0) {
      // Set search term to the highlighted suggestion, but do not search yet
      const selectedSuggestion = suggestions[highlightedIndex].name;
      setSearchTerm(selectedSuggestion); // Fill the input with highlighted suggestion
      setShowSuggestions(false);
      inputRef.current.value = selectedSuggestion; // Manually set the input field value
    } else if (e.key === 'Enter' && !showSuggestions) {
      // Trigger search click when no suggestions are shown or after suggestion has been selected
      handleSearchClick();
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
    <div id="section4" className="section4" ref={ref}>
      <div className="overlay4">
        <p className="whosays4">
          GUESS WHO SAYS THIS QUOTE?
          <br />
          <span className="rounds4" style={{ marginTop: '-10px' }}>(ROUND 2)</span>
        </p>
        <p className="quotey4"><span className="thequote4">{quote}</span></p>

        <div className="search-bar-container4">
          <input
            ref={inputRef}
            type="text"
            className="search-input4"
            placeholder="Type a name..."
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown} // Add keydown listener
          />
          <button className="search-button4" onClick={handleSearchClick}>
            <img src={require('../assets/search.png')} alt="Search" className="search-icon4" />
          </button>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list4">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`suggestion-item4 ${index === highlightedIndex ? 'highlighted' : ''}`}
                  onMouseDown={() => setSearchTerm(suggestion.name)} // On click, set the search term
                >
                  <img
                    className="suggestion-image4"
                    src={`https://storage.googleapis.com/motivdle-images/${suggestion.icon}`}
                    alt={suggestion.name}
                  />
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="guess-tracker4">You have made <span className='guess-number4'>{guessCount}</span> guesses</p>
        <div className="button-container4">
          <button className="hint-button4" onClick={toggleHint1} data-tooltip="Character Clue">
            <img className="icons4" src={require('../assets/details-clue.png')} alt="Character Clue" />
          </button>

          <button className="hint-button" onClick={toggleHint2} data-tooltip="Achievements Clue">
            <img className="icons4" src={require('../assets/achievements-clue.png')} alt="Achievements Clue" />
          </button>

          <button className="audio-button" onClick={handleAudioToggle} data-tooltip="Audio Clue">
            <img className="icons4" src={require('../assets/audio-clue.png')} alt="Audio Clue" />
          </button>
        </div>

        <div className="hint-container4">
          {showHint1 && (
            <div className="hint-bubble4">{hint1}</div>
          )}

          {showHint2 && (
            <div className="hint-bubble4">{hint2}</div>
          )}
        </div>

        <div className="incorrect-guesses4">
          {incorrectGuesses.map((guess, index) => (
            <p key={index} className="incorrect-guess-text4">{guess.toUpperCase()}</p>
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
      </div>
    </div>
  );
});

export default Section2;
