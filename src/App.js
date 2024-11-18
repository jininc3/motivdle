// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Home2 from './components/Home2';
import Home3 from './components/Home3';
import Section3 from './components/Section3';
import Preloader from './components/Preloader'; // Import Preloader
import logo from './assets/cheetah-logo2.png';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <Router>
      {!isLoaded && <Preloader onLoadComplete={() => setIsLoaded(true)} />}
      {isLoaded && (
        <div className="App">
          <div className="logo-container">
            <a href="/"><img src={logo} alt="Cheetah Logo" className="cheetah-logo" /></a>
            <div className="motivdle-small">MOTIVDLE</div>
          </div>

          <button className={`menu-button ${isNavOpen ? 'open' : ''}`} onClick={toggleNav}>
            Menu
          </button>

          <div className={`nav-menu ${isNavOpen ? 'open' : ''}`}>
            <div className="nav-item"><a href="/">HOME</a></div>
            <div className="nav-item"><a href="/?showSection=section2">ROUND 1</a></div>
            <div className="nav-item"><a href="/home2">ROUND 2</a></div>
            <div className="nav-item"><a href="/home3">ROUND 3</a></div>
          </div>

          <Routes>
          <Route path="/" element={<Home toggleNav={toggleNav} />} />
            <Route path="/home2" element={<Home2 />} />
            <Route path="/home3" element={<Home3 />} />
            <Route path="/section3" element={<Section3 />} />
          </Routes>
        </div>
      )}
    </Router>
  );
}

export default App;
