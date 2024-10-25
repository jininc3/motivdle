import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import './Section1.css'; // Keep the styles for Section1
import './Section2.css';
import Section3 from './Section3';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc, setDoc, } from 'firebase/firestore';

function Home() {
    const [isSection2Visible, setIsSection2Visible] = useState(false);
    const [isSection3Visible, setIsSection3Visible] = useState(false);
    const [influencerName] = useState("");
    const [videoFile, setVideoFile] = useState("");
    const [isButtonVisible, setButtonVisible] = useState(false); // Merged from Section1.js
    const [backgroundStyle] = useState({});

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
    
    const audioRef = useRef(null);
    const inputRef = useRef(null);

    const section2Ref = useRef(null);
    const section3Ref = useRef(null);
    const location = useLocation();
    
    useEffect(() => {
        inputRef.current?.focus();
      }, []);

    // Section1 functionality: Show button after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setButtonVisible(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const showSection = params.get('showSection');
  
      if (showSection === 'section2') {
          setIsSection2Visible(true); // Display Section2
      } else {
          setIsSection2Visible(false); // Hide Section2 if the parameter is not set
      }
  }, [location]);

    // Scroll to Section2 when "MOTIVDLE GAME" is clicked
    useEffect(() => {
        if (isSection2Visible && section2Ref.current) {
            section2Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSection2Visible]);

    // Scroll to Section3 after the correct answer is given and update styles
    useEffect(() => {
        if (isSection3Visible && section3Ref.current) {
            section3Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSection3Visible]);

    const handleScrollToSection2 = () => {
        setIsSection2Visible(true); // Makes Section2 visible
        setTimeout(() => {
            section2Ref.current.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Delay ensures Section2 is rendered before scrolling
    };

  

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
      
      
      const handleSearchClick = () => {
        const guessedName = inputRef.current.value.trim().toLowerCase();

        if (guessedName === influencerName.toLowerCase()) {
            setIsSection3Visible(true); 
            setTimeout(() => {
              section3Ref.current.scrollIntoView({ behavior: 'smooth' });
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
        <div style={backgroundStyle}> {/* Apply dynamic background style here */}
            <div className="background-home"></div>

            {/* Section1 Content */}
            <div id="section1" className="section1">
                <h1 className="title-home">MOTIVDLE</h1>
                <p className="description">
                    The game where you guess who says the motivational quote, and in hopes of taking away some inspiration.
                    I'm a big fan of quotes from actual achievers so the quotes are strictly from real-life winners.
                </p>
                <button
                    id="scrollButton"
                    className={`test-button ${isButtonVisible ? 'fade-in' : ''}`}
                    onClick={handleScrollToSection2}
                >
                    MOTIVDLE ROUND 1
                </button>
            </div>

            {/* Section2 Content */}
            {isSection2Visible && (
                
                    
                    <div id="section2" className="section" ref={section2Ref} >
     
      <div className="overlay2">
        
        <p className="whosays">
          Guess Who Says This Quote?
          <br />
          <span className="rounds" style={{ marginTop: '-10px' }}>(ROUND 1)</span>
        </p>
        <div className="quoteandclue">
        <p className="quotey"><span className="thequote">{quote}</span></p>
        <div className="button-container">
  <div className="hint-wrapper">
    <button
      className={`hint-button ${guessCount >= 2 ? 'enabled-button' : 'disabled-button'}`}
      onClick={guessCount >= 2 ? toggleHint1 : null}
      data-tooltip={guessCount >= 2 ? "Character Clue" : "Clue after 2 guesses"}
    >
      <img className="icons" src={require('../assets/details-clue.png')} alt="Character Clue" />
    </button>
    <span className="hint-description">FIRST CLUE</span> {/* Add text description */}
  </div>

  <div className="hint-wrapper">
    <button
      className={`hint-button ${guessCount >= 5 ? 'enabled-button' : 'disabled-button'}`}
      onClick={guessCount >= 5 ? toggleHint2 : null}
      data-tooltip={guessCount >= 5 ? "Achievements Clue" : "Clue after 5 guesses"}
    >
      <img className="icons" src={require('../assets/achievements-clue.png')} alt="Achievements Clue" />
    </button>
    <span className="hint-description">SECOND CLUE</span> {/* Add text description */}
  </div>

  <div className="hint-wrapper">
    <button
      className={`audio-button ${guessCount >= 7 ? 'enabled-button' : 'disabled-button'}`}
      onClick={guessCount >= 7 ? handleAudioToggle : null}
      data-tooltip={guessCount >= 7 ? "Audio Clue" : "Clue after 7 guesses"}
    >
      <img className="icons" src={require('../assets/audio-clue.png')} alt="Audio Clue" />
    </button>
    <span className="hint-description">AUDIO CLUE</span> {/* Add text description */}
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
      
                
            )}

            {/* Section3 Content */}
            {isSection3Visible && (
                <Section3
                    ref={section3Ref}
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

export default Home;
