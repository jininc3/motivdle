import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Section1 from './components/Section1';
import Section3 from './components/Section3';
import Section2 from './components/Section2';
import logo from './assets/cheetah-logo2.png';


function App() {
  const [isNavOpen, setIsNavOpen] = useState(true);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <Router>
      <div className="App">
        {/* Logo at the top center */}
        <div className="logo-container">
  
        <a href="/"><img src={logo} alt="Cheetah Logo" className="cheetah-logo" /></a>
          
  <div className="motivdle-small">MOTIVDLE</div>
</div>


        {/* Menu Button */}
        <button className={`menu-button ${isNavOpen ? 'open' : ''}`} onClick={toggleNav}>
          Menu
        </button>

        {/* Right-side navigation menu */}
        <div className={`nav-menu ${isNavOpen ? 'open' : ''}`}>
          <div className="nav-item"><a href="/">HOME</a></div>
          <div className="nav-item"><a href="/section2">ROUND 1</a></div>
          <div className="nav-item"><a href="/contact">ROUND 2</a></div>
          <div className="nav-item"><a href="/help">ROUND 3</a></div>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/section1" element={<Section1 />} />
          <Route path="/section3" element={<Section3 />} />
          <Route path="/section2" element={<Section2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
