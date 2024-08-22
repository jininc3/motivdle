// src/Section2.js
import React, { useEffect, useState, useRef } from 'react';
import './Section2.css';

const quotes = [
  "\"Dream big. Start small. Act now.\" - Robin Sharma",
  "\"Believe you can and you're halfway there.\" - Theodore Roosevelt",
  "\"Stay hungry, stay foolish.\" - Steve Jobs",
  "\"You miss 100% of the shots you don’t take.\" - Wayne Gretzky",
  "\"Act as if what you do makes a difference. It does.\" - William James",
  "\"Success is not final, failure is not fatal: It is the courage to continue that counts.\" - Winston Churchill",
  "\"The only limit to our realization of tomorrow is our doubts of today.\" - Franklin D. Roosevelt",
  "\"Don’t watch the clock; do what it does. Keep going.\" - Sam Levenson",
  "\"Everything you’ve ever wanted is on the other side of fear.\" - George Addair",
  "\"Hardships often prepare ordinary people for an extraordinary destiny.\" - C.S. Lewis",
  "\"You are never too old to set another goal or to dream a new dream.\" - C.S. Lewis",
  "\"Believe in yourself and all that you are.\" - Christian D. Larson",
  "\"The future belongs to those who believe in the beauty of their dreams.\" - Eleanor Roosevelt",
  "\"Don’t let yesterday take up too much of today.\" - Will Rogers",
  "\"You are braver than you believe, stronger than you seem, and smarter than you think.\" - A.A. Milne",
  "\"The only way to achieve the impossible is to believe it is possible.\" - Charles Kingsleigh",
  "\"Start where you are. Use what you have. Do what you can.\" - Arthur Ashe",
  "\"What we think, we become.\" - Buddha",
  "\"The best time to plant a tree was 20 years ago. The second best time is now.\" - Chinese Proverb",
  "\"It always seems impossible until it’s done.\" - Nelson Mandela",
  "\"Don’t wait. The time will never be just right.\" - Napoleon Hill",
  "\"Success is not how high you have climbed, but how you make a positive difference to the world.\" - Roy T. Bennett",
  "\"Go confidently in the direction of your dreams. Live the life you have imagined.\" - Henry David Thoreau",
  "\"Your time is limited, so don’t waste it living someone else’s life.\" - Steve Jobs",
  "\"If you want to fly, give up everything that weighs you down.\" - Buddha",
  "\"The best way to predict the future is to create it.\" - Peter Drucker",
  "\"Small steps in the right direction can turn out to be the biggest step of your life.\" - Unknown",
  "\"You don’t have to be great to start, but you have to start to be great.\" - Zig Ziglar",
  "\"The only way to do great work is to love what you do.\" - Steve Jobs",
  "\"Success usually comes to those who are too busy to be looking for it.\" - Henry David Thoreau",
  "\"Don’t be afraid to give up the good to go for the great.\" - John D. Rockefeller",
  "\"I find that the harder I work, the more luck I seem to have.\" - Thomas Jefferson",
  "\"The secret to getting ahead is getting started.\" - Mark Twain",
  "\"What you do today can improve all your tomorrows.\" - Ralph Marston",
  "\"The harder the battle, the sweeter the victory.\" - Les Brown",
  "\"You are capable of amazing things.\" - Unknown",
  "\"Your limitation—it’s only your imagination.\" - Unknown",
  "\"Push yourself, because no one else is going to do it for you.\" - Unknown",
  "\"Sometimes later becomes never. Do it now.\" - Unknown",
  "\"Great things never come from comfort zones.\" - Unknown",
  "\"Dream it. Wish it. Do it.\" - Unknown",
  "\"Success doesn’t just find you. You have to go out and get it.\" - Unknown",
  "\"The harder you work for something, the greater you’ll feel when you achieve it.\" - Unknown",
  "\"Dream bigger. Do bigger.\" - Unknown",
  "\"Don’t stop when you’re tired. Stop when you’re done.\" - Unknown",
  "\"Wake up with determination. Go to bed with satisfaction.\" - Unknown",
  "\"Do something today that your future self will thank you for.\" - Unknown",
  "\"Little things make big days.\" - Unknown",
  "\"It’s going to be hard, but hard does not mean impossible.\" - Unknown",
  "\"Don’t wait for opportunity. Create it.\" - Unknown"
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
      <button ref={buttonRef} className="quote-button2" id="transitionButton" onClick={handleScroll}>MOTIVATIONAL IMAGE</button>
    </div>
  );
});

export default Section2;