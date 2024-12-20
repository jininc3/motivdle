import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import './Section1.css'; // Keep the styles for Section1
import './Section2.css';
import Section3 from './Section3';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import titleImage from '../assets/m10.png';

import { collection, getDocs, doc, getDoc, setDoc, } from 'firebase/firestore';

function Home() {
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
    const [profile, setProfile] = useState(false);
    const [showModal, setShowModal] = useState(false);



    
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
              setProfile(dailyQuote.profile);
              
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
              setProfile(selectedQuote.profile); 

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
  
      // Check if the input matches one of the suggestions
      const isValidSuggestion = suggestions.some(
          (suggestion) => suggestion.name.toLowerCase() === guessedName
      );
  
      if (!isValidSuggestion) {
          setShowModal(true); // Show the modal
          inputRef.current.value = ""; // Clear the input
          return; // Exit the function early
      }
  
      // Proceed with the original functionality
      if (guessedName === influencerName.toLowerCase()) {
          setIsSection3Visible(true);
          setTimeout(() => {
              section3Ref.current.scrollIntoView({ behavior: 'smooth' });
          }, 100);
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
        const querySnapshot = await getDocs(quotesCollection);

        // Filter suggestions based on search term matching first or last name
        const results = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const nameParts = data.name.toLowerCase().split(" "); // Split name into parts (first and last)
            return {
                name: data.name,
                icon: data.icon,
                matches: nameParts.some(part => part.startsWith(lowerCaseValue)) // Check if any part matches
            };
        }).filter(suggestion => suggestion.matches); // Keep only matching suggestions

        // Remove duplicates
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
    setHighlightedIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : 0
    );
  } else if (e.key === 'Enter') {
    if (showSuggestions && highlightedIndex >= 0) {
      const selectedSuggestion = suggestions[highlightedIndex].name;
      setSearchTerm(selectedSuggestion);
      inputRef.current.value = selectedSuggestion;
      setShowSuggestions(false);
      handleSearchClick();
    } else {
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
    
   

    return (
        <div style={backgroundStyle}> {/* Apply dynamic background style here */}
            <div className="background-home"></div>

            {/* Section1 Content */}
            <div id="section1" className="section1">
            <img src={titleImage} alt="MOTIVDLE" className="title-home" />
            <br></br><br></br>
                <p className="description">
                GUESS THE QUOTE.<br></br> GET INSPIRED.
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
          GUESS THE VOICE OF INSPIRATION<br />
          <span className="rounds" style={{ marginTop: '-10px' }}>ROUND 1</span></p>
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
      className="audio-button enabled-button" // Always enabled
      onClick={handleAudioToggle}
      data-tooltip="Audio Clue"
    >
      <img className="icons" src={require('../assets/audio-clue.png')} alt="Audio Clue" />
    </button>
    <span className="hint-description">AUDIO CLUE</span>
  </div>

  <div className="hint-wrapper">
        <button
            className="give-up-button enabled-button"
            onClick={() => {
                setIsSection3Visible(true);
                setTimeout(() => {
                    section3Ref.current.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }}
            data-tooltip="Skip to Section 3"
        >
            <img className="icons" src={require('../assets/give-up.png')} alt="Give Up" />
        </button>
        <span className="hint-description3">GIVE UP</span>
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
            <img src={require('../assets/red-arrow.png')} alt="Search" className="search-icon" />
          </button>
          {showSuggestions && suggestions.length > 0 && (
           <ul className="suggestions-list2">
           {suggestions.map((suggestion, index) => (
             <li
               key={index}
               className={`suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
               ref={index === highlightedIndex ? (el) => el?.scrollIntoView({ block: 'nearest' }) : null}
               onMouseDown={() => {
                 const selectedSuggestion = suggestion.name;
                 setSearchTerm(selectedSuggestion);
                 inputRef.current.value = selectedSuggestion;
                 setShowSuggestions(false);
                 handleSearchClick();
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
                    profileDescription={profile} 


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

export default Home;