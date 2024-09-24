import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Section3 from './components/Section3';
import Home2 from './components/Home2'; // Import Home2 component

import Section5 from './components/Section5'; // Import Section5 component


function App() {
  return (
    <Router>
      <div className="App">
        <div className="overlay"></div>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Main Home route */}
          <Route path="/section3" element={<Section3 />} /> {/* Section3 route */}
          <Route path="/section4" element={<Home2 />} /> {/* Home2 route to handle Section4 and Section5 */}
          <Route path="/section5" element={<Section5 />} /> {/* Separate route for Section5 */}
          <Route path="/home" element={<Home/>}/>
          
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
