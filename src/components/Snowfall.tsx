import React from 'react';
import './Snowfall.css'; // Import snowfall styles

const Snowfall: React.FC = () => {
  const snowflakes = Array.from({ length: 50 });

  return (
    <>
      {snowflakes.map((_, index) => (
        <div
          key={index}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></div>
      ))}
    </>
  );
};

export default Snowfall;

