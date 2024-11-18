import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import './Section2.css'; // Reuse Section2 styles
import Section5 from './Section5'; // Section5 remains separate for round completion
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc, setDoc, } from 'firebase/firestore';
import './Section5.css';

function Home2() {
    const [isSection5Visible, setIsSection5Visible] = useState(false);
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
    const [influencerName, setInfluencerName] = useState("");
    const [quoteInfluencer] = useState("");
    const [videoFile, setVideoFile] = useState("");
    const section5Ref = useRef(null);
    const [backgroundStyle, setBackgroundStyle] = useState({});
    const [isFlashingFirstHint, setIsFlashingFirstHint] = useState(true);
const [isFlashingSecondHint, setIsFlashingSecondHint] = useState(true); // 

    const inputRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
      if (isSection5Visible) {
          setBackgroundStyle({
              backgroundColor: 'rgba(0, 0, 0, 0.7)', // This adds a dark overlay effect
              transition: 'background-color 0.5s ease' // Smooth transition effect
          });
      } else {
          setBackgroundStyle({
              backgroundColor: 'rgba(0, 0, 0, 0)', // Revert to normal when Section5 is not visible
              transition: 'background-color 0.5s ease'
          });
      }
  }, [isSection5Visible]);


    useEffect(() => {
        const fetchQuoteOfTheDay = async () => {
            const today = new Date();
            const currentDay = today.toDateString();

            const quoteOfTheDayDoc = await getDoc(doc(db, 'quoteOTD', 'quoteOfTheDay2'));

            if (quoteOfTheDayDoc.exists() && quoteOfTheDayDoc.data().date === currentDay) {
                const dailyQuote = quoteOfTheDayDoc.data();
                setQuote(`"${dailyQuote.quote}"`);
                setInfluencerName(dailyQuote.name);
                setHint1(dailyQuote.hint1);
                setHint2(dailyQuote.hint2);
                setAudioFile(dailyQuote.audio);
                setVideoFile(dailyQuote.video);
            } else {
                const quotesCollection = collection(db, 'quotes');
                const quoteSnapshot = await getDocs(quotesCollection);
                const quotesList = quoteSnapshot.docs.filter(doc => doc.id !== 'quoteOfTheDay2');

                const randomIndex = Math.floor(Math.random() * quotesList.length);
                const selectedQuote = quotesList[randomIndex].data();

                setQuote(`"${selectedQuote.quote}"`);
                setInfluencerName(selectedQuote.name);
                setHint1(selectedQuote.hint1);
                setHint2(selectedQuote.hint2);
                setAudioFile(selectedQuote.audio);
                setVideoFile(selectedQuote.video);

                await setDoc(doc(db, 'quoteOTD', 'quoteOfTheDay2'), {
                    ...selectedQuote,
                    date: currentDay,
                });
            }
        };

        fetchQuoteOfTheDay();
    }, []);

    const handleSearchClick = () => {
        const guessedName = inputRef.current.value.trim().toLowerCase();

        if (guessedName === influencerName.toLowerCase()) {
            setIsSection5Visible(true); 
            
            setTimeout(() => {
              section5Ref.current.scrollIntoView({ behavior: 'smooth' });
          }, 100);// Show Section5 after a correct guess
        } else {
            setIncorrectGuesses([...incorrectGuesses, guessedName]);
            setGuessCount(guessCount + 1);
            setSearchTerm("");
        inputRef.current.value = ""; 
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
            setHighlightedIndex(-1); 
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
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

        
    const toggleHint1 = () => {
      setShowHint1(!showHint1);
      setIsFlashingFirstHint(false); // Stop flashing when the button is clicked
      if (showHint2) setShowHint2(false);
  };
  
  const toggleHint2 = () => {
      setShowHint2(!showHint2);
      setIsFlashingSecondHint(false); // Stop flashing when the second button is clicked
      if (showHint1) setShowHint1(false);
  };

    return (
      <div style={backgroundStyle}>
      
        <div id="section2" className="section" ref={section5Ref} >
        <div className="overlay2">
                <p className="whosays">
                  Guess Who Says This Quote?<br />
                  <span className="rounds" style={{ marginTop: '-10px' }}>(ROUND 1)</span></p>
                <div className="quoteandclue">
                <p className="quotey"><span className="thequote">{quote}</span></p>
                <div className="button-container">
                <div className="hint-wrapper">
            <button
                className={`hint-button enabled-button ${isFlashingFirstHint && guessCount >= 2 ? 'flash-hint' : ''}`} // Apply flash class based on state
                onClick={toggleHint1}
                data-tooltip="Character Clue">
                <img className="icons" src={require('../assets/details-clue.png')} alt="Character Clue" />
            </button>
            <span className="hint-description">FIRST CLUE</span>
        </div>
        <div className="hint-wrapper">
            <button
                className={`hint-button enabled-button ${isFlashingSecondHint && guessCount >= 4 ? 'flash-hint' : ''}`} // Apply flash class based on state and guess count
                onClick={toggleHint2}
                data-tooltip="Achievements Clue">
                <img className="icons" src={require('../assets/achievements-clue.png')} alt="Achievements Clue" />
            </button>
            <span className="hint-description">SECOND CLUE</span>
        </div>
        
        
          <div className="hint-wrapper">
            <button
              className="audio-button enabled-button" // Always enabled
              onClick={handleAudioToggle}
              data-tooltip="Audio Clue"
            >
              <img className="icons" src={require('../assets/audio-clue.png')} alt="Audio Clue" />
            </button>
            <span className="hint-description">AUDIO CLUE</span>
          </div>
        </div>
        
        
        
                <div className="hint-container">
          {showHint1 && (
            <div className="hint-bubble hint-bubble1">{hint1}</div>
          )}
        
          {showHint2 && (
            <div className="hint-bubble hint-bubble2">{hint2}</div>
          )}
        </div>
                </div>
        
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
              
                        
                   
        
                    {/* Section3 Content */}
                    {isSection5Visible && (
                        <Section5
                            ref={section5Ref}
                            influencerName={influencerName}
                            videoFileName={videoFile}
        
        
                        />
                    )}
        
                    <footer className="footer">
                        <p>&copy; 2024 Motivdle. All rights reserved.</p>
                    </footer>
                </div>
            );
        }
        
        export default Home2;
        
