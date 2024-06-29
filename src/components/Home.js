import React from 'react';
import './Home.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';


function Home() {
    const navigate = useNavigate();

  const handleQuoteClick = () => {
    navigate('/quote');
  };



  return (
    <div className="home">
      <div className="background-home"></div>
      <div className="overlay1">   
        <p className="subsubtitle">Today's genre:<br></br> Chase your dreams</p>
          <button className="quote-button" onClick={handleQuoteClick}>Motivational quote</button>
      
          </div>
        
    </div>
    
  );
}

export default Home;
