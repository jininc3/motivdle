import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import './Section1.css'; // Keep the styles for Section1
import './Section2.css';
import Section3 from './Section3';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc, setDoc, } from 'firebase/firestore';

function Home({ toggleNav }) {
    const [isSection2Visible, setIsSection2Visible] = useState(false);
    const [isSection3Visible, setIsSection3Visible] = useState(false);
    const [influencerName, setInfluencerName] = useState("");
    const [videoFile, setVideoFile] = useState("");
    const [isButtonVisible, setButtonVisible] = useState(false); // Merged from Section1.js
    const [backgroundStyle, setBackgroundStyle] = useState({});

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
    const [quoteInfluencer] = useState(""); // Define state for the influencer
    const [isFlashingFirstHint, setIsFlashingFirstHint] = useState(true);
const [isFlashingSecondHint, setIsFlashingSecondHint] = useState(true); // 


    
    const audioRef = useRef(null);
    const inputRef = useRef(null);

    const section2Ref = useRef(null);
    const section3Ref = useRef(null);
    const location = useLocation();
 

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

            inputRef.current?.focus();
        }
    }, [isSection2Visible]);

    // Scroll to Section3 after the correct answer is given and update styles
    useEffect(() => {
        if (isSection3Visible && section3Ref.current) {
            section3Ref.current.scrollIntoView({ behavior: 'smooth' });
            setBackgroundStyle({ backgroundColor: 'rgba(0, 0, 0, 0.7)', transition: 'background-color 0.5s ease' });
            
        }
    }, [isSection3Visible]);

    const handleScrollToSection2 = () => {
        setIsSection2Visible(true); // Makes Section2 visible
        toggleNav();
        setTimeout(() => {
            section2Ref.current.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Delay ensures Section2 is rendered before scrolling
    };

  

    useEffect(() => {
      const fetchQuoteOfTheDay = async () => {
          const today = new Date();
          const currentDay = today.toDateString();

          const quoteOfTheDayDoc = await getDoc(doc(db, 'quoteOTD', 'quoteOfTheDay'));

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
              const quotesList = quoteSnapshot.docs.filter(doc => doc.id !== 'quoteOfTheDay');

              const randomIndex = Math.floor(Math.random() * quotesList.length);
              const selectedQuote = quotesList[randomIndex].data();

              setQuote(`"${selectedQuote.quote}"`);
              setInfluencerName(selectedQuote.name);
              setHint1(selectedQuote.hint1);
              setHint2(selectedQuote.hint2);
              setAudioFile(selectedQuote.audio);
              setVideoFile(selectedQuote.video);

              await setDoc(doc(db, 'quoteOTD', 'quoteOfTheDay'), {
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
        setIsFlashingFirstHint(false); // Stop flashing when the button is clicked
        if (showHint2) setShowHint2(false);
    };
    
    const toggleHint2 = () => {
        setShowHint2(!showHint2);
        setIsFlashingSecondHint(false); // Stop flashing when the second button is clicked
        if (showHint1) setShowHint1(false);
    };
    



      
      


    return (
        <div style={backgroundStyle}> {/* Apply dynamic background style here */}
            <div className="background-home"></div>

            {/* Section1 Content */}
            <div id="section1" className="section1">
                <h1 className="title-home">MOTIVDLE</h1>
                <p className="description">
                "Guess who said the motivational quote and take away some inspiration! All quotes are from real-life achievers and winners."
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
