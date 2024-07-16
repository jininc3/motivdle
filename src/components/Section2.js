import React, { useEffect, useState, useRef } from 'react';
import './Section2.css';

const quotes = [
  "\"Dreams don't work unless you do.\" - John C. Maxwell",
  "\"The only way to do great work is to love what you do.\" - Steve Jobs",
  "\"The future belongs to those who believe in the beauty of their dreams.\" - Eleanor Roosevelt",
  "\"Don't watch the clock; do what it does. Keep going.\" - Sam Levenson",
  "\"Keep your face always toward the sunshine—and shadows will fall behind you.\" - Walt Whitman",
  "\"The best way to predict the future is to create it.\" - Peter Drucker",
  "\"Your time is limited, don't waste it living someone else's life.\" - Steve Jobs",
  "\"Success is not final, failure is not fatal: It is the courage to continue that counts.\" - Winston Churchill",
  "\"I have not failed. I've just found 10,000 ways that won't work.\" - Thomas Edison",
  "\"Failure is simply the opportunity to begin again, this time more intelligently.\" - Henry Ford",
  "\"The price of success is hard work, dedication to the job at hand, and the determination that whether we win or lose, we have applied the best of ourselves to the task at hand.\" - Vince Lombardi",
  "\"I've missed more than 9,000 shots in my career. I've lost almost 300 games. Twenty-six times I've been trusted to take the game-winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed.\" - Michael Jordan",
  "\"It’s fine to celebrate success but it is more important to heed the lessons of failure.\" - Bill Gates",
  "\"The way to get started is to quit talking and begin doing.\" - Walt Disney",
  "\"The biggest risk is not taking any risk. In a world that is changing really quickly, the only strategy that is guaranteed to fail is not taking risks.\" - Mark Zuckerberg",
  "\"Success is liking yourself, liking what you do, and liking how you do it.\" - Maya Angelou",
  "\"Do not be embarrassed by your failures, learn from them and start again.\" - Richard Branson",
  "\"People who succeed have momentum. The more they succeed, the more they want to succeed, and the more they find a way to succeed. Similarly, when someone is failing, the tendency is to get on a downward spiral that can even become a self-fulfilling prophecy.\" - Tony Robbins",
  "\"The future belongs to those who believe in the beauty of their dreams.\" - Eleanor Roosevelt",
  "\"The only place where success comes before work is in the dictionary.\" - Vidal Sassoon",
  "\"The best revenge is massive success.\" - Frank Sinatra",
  "\"Success usually comes to those who are too busy to be looking for it.\" - Henry David Thoreau",
  "\"Don't be afraid to give up the good to go for the great.\" - John D. Rockefeller",
  "\"I find that the harder I work, the more luck I seem to have.\" - Thomas Jefferson",
  "\"Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.\" - Albert Schweitzer",
  "\"Success is not in what you have, but who you are.\" - Bo Bennett",
  "\"Success is how high you bounce when you hit bottom.\" - George S. Patton",
  "\"The secret of success is to do the common thing uncommonly well.\" - John D. Rockefeller Jr.",
  "\"Success is not how high you have climbed, but how you make a positive difference to the world.\" - Roy T. Bennett",
  "\"Success is getting what you want, happiness is wanting what you get.\" - W. P. Kinsella",
  "\"To succeed in life, you need two things: ignorance and confidence.\" - Mark Twain",
  "\"Success seems to be connected with action. Successful people keep moving. They make mistakes but they don't quit.\" - Conrad Hilton",
  "\"Don't be distracted by criticism. Remember—the only taste of success some people get is to take a bite out of you.\" - Zig Ziglar",
  "\"The road to success and the road to failure are almost exactly the same.\" - Colin R. Davis",
  "\"Success is not the absence of failure; it's the persistence through failure.\" - Aisha Tyler",
  "\"Success is walking from failure to failure with no loss of enthusiasm.\" - Winston Churchill",
  "\"Success is not the key to happiness. Happiness is the key to success.\" - Albert Schweitzer",
  "\"Success is not in never falling, but in rising every time we fall.\" - Confucius",
  "\"I can't give you a sure-fire formula for success, but I can give you a formula for failure: try to please everybody all the time.\" - Herbert Bayard Swope",
  "\"Success is the sum of small efforts, repeated day in and day out.\" - Robert Collier",
  "\"In order to succeed, your desire for success should be greater than your fear of failure.\" - Bill Cosby",
  "\"Success is not a destination, it's a journey.\" - Zig Ziglar",
  "\"Success is not something that happens to you; it's something that happens because of you and because of the actions you take.\" - Grant Cardone",
  "\"Success means doing the best we can with what we have. Success is the doing, not the getting; in the trying, not the triumph.\" - Zig Ziglar",
  "\"The only limit to our realization of tomorrow is our doubts of today.\" - Franklin D. Roosevelt",
  "\"Success is not just what you accomplish in your life; it is about what you inspire others to do.\" - Anonymous",
  "\"Success is achieved and maintained by those who try and keep trying.\" - W. Clement Stone",
  "\"Success is simple. Do what's right, the right way, at the right time.\" - Arnold H. Glasow",
  "\"Success is going from failure to failure without losing your enthusiasm.\" - Winston Churchill",
  "\"Success is a state of mind. If you want success, start thinking of yourself as a success.\" - Joyce Brothers",
];


const Section2 = React.forwardRef(({ handleScroll }, ref) => {
  const [quote, setQuote] = useState("");
  const quoteyRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    const quoteIndex = today.getDate() % quotes.length;
    setQuote(quotes[quoteIndex]);

    if (quoteyRef.current) {
      setTimeout(() => {
        quoteyRef.current.classList.add('fade-in');
      }, 800); // Adjust the delay as needed
    }

    if (buttonRef.current) {
      setTimeout(() => {
        buttonRef.current.classList.add('fade-in');
      }, 1000); // Adjust the delay as needed
    }
  }, []);

  return (
    <div id="section2" className="section" ref={ref}>
      <div className="overlay2">
        <p ref={quoteyRef} className="quotey fade-in-element">{quote}</p>
      </div>
      <button ref={buttonRef} className="quote-button2" id="transitionButton" onClick={handleScroll}>Motivational Image</button>
    </div>
  );
});

export default Section2;
