import React, { useEffect, useState, useRef } from 'react';
import './Section2.css';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';


const Section2 = React.forwardRef(({ handleScroll, onSearchMatch }, ref) => {
  const [quote, setQuote] = useState("");
  const [quoteInfluencer, setQuoteInfluencer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);  // Suggestions will now include name and icon
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [guessCount, setGuessCount] = useState(0); 
  const [incorrectGuesses, setIncorrectGuesses] = useState([]); 
  const [hint1, setHint1] = useState(""); 
  const [showHint1, setShowHint1] = useState(false); 
  const [hint2, setHint2] = useState(""); 
  const [showHint2, setShowHint2] = useState(false); 
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      const quotesCollection = collection(db, 'quotes');
      const quoteSnapshot = await getDocs(quotesCollection);
      const quotesList = quoteSnapshot.docs.map(doc => ({
        text: doc.data().quote,
        influencer: doc.data().name,
        icon: doc.data().icon, // Fetch icon
        hint1: doc.data().hint1, 
        hint2: doc.data().hint2, 
        audio: doc.data().audio, 
        video: doc.data().video
      }));

      const today = new Date();
      const quoteIndex = today.getDate() % quotesList.length;
      setQuote(`"${quotesList[quoteIndex].text}"`);
      setQuoteInfluencer(quotesList[quoteIndex].influencer);
      setHint1(quotesList[quoteIndex].hint1); 
      setHint2(quotesList[quoteIndex].hint2); 
      setAudioFile(quotesList[quoteIndex].audio);
      setVideoFile(quotesList[quoteIndex].video);
    };

    fetchQuotes();
  }, []);

  useEffect(() => {
    console.log("Audio file being set:", audioFile);  // Log the value of audioFile
  }, [audioFile]);
  
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
          onSearchMatch(quoteInfluencer); 
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
      const quotesCollection = collection(db, 'quotes');
      const q = query(
        quotesCollection,
        where('name', '>=', value),
        where('name', '<=', value + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      
      // Store both name and icon in suggestions
      const results = querySnapshot.docs.map(doc => ({
        name: doc.data().name.toUpperCase(),
        icon: doc.data().icon, // Include icon in suggestions
      }));

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

  // Toggle functions with logic to close other clues
  const toggleHint1 = () => {
    setShowHint1(!showHint1); 
    if (showHint2) setShowHint2(false); // Hide hint2 if it's visible
  };

  const toggleHint2 = () => {
    setShowHint2(!showHint2); 
    if (showHint1) setShowHint1(false); // Hide hint1 if it's visible
  };

  return (
    <div id="section2" className="section" ref={ref}>
      <div className="overlay2">
        <p className="whosays">WHO SAYS THIS QUOTE</p>
        <p className="quotey">{quote}</p>

        {/* The image in the middle was removed here */}

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
                <li key={index} className="suggestion-item" onMouseDown={() => setSearchTerm(suggestion.name)}>
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

        {/* Render the hints below the buttons */}
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

        {/* Conditionally render the audio element only if audioFile is set */}
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