import React, { useState, useEffect, useRef } from 'react';
import './Home.css'; // Reuse Home styles
import './Section2.css'; // Reuse Section2 styles for consistency
import Section6 from './Section6'; // Use Section6 as the final section for this round
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';

function Home3() {
    const [isSection6Visible, setIsSection6Visible] = useState(false);
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
    const [videoFile, setVideoFile] = useState("");
    const section6Ref = useRef(null);
    const [quoteInfluencer] = useState("");
    const [isFlashingFirstHint, setIsFlashingFirstHint] = useState(true);
const [isFlashingSecondHint, setIsFlashingSecondHint] = useState(true); // 
const [backgroundStyle, setBackgroundStyle] = useState({});
const [showModal, setShowModal] = useState(false);

    const inputRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
      window.scrollTo(0, 0); // Ensure the page scrolls to the top
  }, []);
  
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
      if (isSection6Visible && section6Ref.current) {
          section6Ref.current.scrollIntoView({ behavior: 'smooth' });
          setBackgroundStyle({ backgroundColor: 'rgba(0, 0, 0, 0.7)', transition: 'background-color 0.5s ease' });
          
      }
  }, [isSection6Visible]);




    useEffect(() => {
        const fetchQuoteOfTheDay = async () => {
            const today = new Date();
            const currentDay = today.toDateString();

            const quoteOfTheDayDoc = await getDoc(doc(db, 'quoteOTD', 'quoteOfTheDay3'));

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
                const quotesList = quoteSnapshot.docs.filter(doc => doc.id !== 'quoteOfTheDay3');
                

                const randomIndex = Math.floor(Math.random() * quotesList.length);
                const selectedQuote = quotesList[randomIndex].data();

                setQuote(`"${selectedQuote.quote}"`);
                setInfluencerName(selectedQuote.name);
                setHint1(selectedQuote.hint1);
                setHint2(selectedQuote.hint2);
                setAudioFile(selectedQuote.audio);
                setVideoFile(selectedQuote.video);

                await setDoc(doc(db, 'quoteOTD', 'quoteOfTheDay3'), {
                    ...selectedQuote,
                    date: currentDay,
                });
            }
        };

        fetchQuoteOfTheDay();
    }, []);

    const handleSearchClick = () => {
      const guessedName = inputRef.current.value.trim().toLowerCase();
  
      // Check if the input matches one of the suggestions
      const isValidSuggestion = suggestions.some(
          (suggestion) => suggestion.name.toLowerCase() === guessedName
      );
  
      if (!isValidSuggestion) {
          setShowModal(true); // Show the modal
          inputRef.current.value = ""; // Clear the input
          return; // Exit the function early
      }
        if (guessedName === influencerName.toLowerCase()) {
            setIsSection6Visible(true); // Show Section6 after a correct guess

            // Scroll to Section6 after it’s set to visible
            setTimeout(() => {
                section6Ref.current.scrollIntoView({ behavior: 'smooth' });
            }, 100); // Delay to ensure rendering
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
  
          // Filter out duplicates based on the 'name' field
          const uniqueResults = results.filter(
              (suggestion, index, self) =>
                  index === self.findIndex((s) => s.name.toLowerCase() === suggestion.name.toLowerCase())
          );
  
          setSuggestions(uniqueResults);
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
      <div style={backgroundStyle}>
      
        <div id="section6" className="section" ref={section6Ref} >
        <div className="overlay2">
                <p className="whosays">
                  Guess Who Says This Quote?<br />
                  <span className="rounds" style={{ marginTop: '-10px' }}>(ROUND 3)</span></p>
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
            <div className="hint-bubble hint-bubble5">{hint1}</div>
          )}
        
          {showHint2 && (
            <div className="hint-bubble hint-bubble6">{hint2}</div>
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
              
                        
                   
        
                   
                    {isSection6Visible && (
                        <Section6
                            ref={section6Ref}
                            influencerName={influencerName}
                            videoFileName={videoFile}
        
        
                        />
                    )}
        {showModal && (
    <div className="modal-overlay">
        <div className="modal">
            <h2>Invalid Input</h2>
            <p>Please select a valid suggestion from the list.</p>
            <button onClick={() => setShowModal(false)}>OK</button>
        </div>
    </div>
)}
                    <footer className="footer">
                        <p>&copy; 2024 Motivdle. All rights reserved.</p>
                    </footer>
                </div>
            );
        }
        
        export default Home3;