import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Home2 from './components/Home2'; // Import Home2
import Section3 from './components/Section3';
import logo from './assets/cheetah-logo2.png';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(true);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <Router>
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
          <div className="nav-item"><a href="/?scrollTo=section2">ROUND 1</a></div> {/* Link to Home */}
          <div className="nav-item"><a href="/home2">ROUND 2</a></div> {/* Link to Home2 */}
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home2" element={<Home2 />} /> {/* Add route for Home2 */}
          <Route path="/section3" element={<Section3 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
