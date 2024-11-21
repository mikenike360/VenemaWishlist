import React, { useState, useEffect } from 'react';

const WishlistCard = ({ user, isFlipped }) => {
  const [isWrapped, setIsWrapped] = useState(true);

  // Sync local state with global flip state
  useEffect(() => {
    setIsWrapped(!isFlipped); // Flip all cards based on the `isFlipped` prop
  }, [isFlipped]);

  const handleToggle = () => {
    setIsWrapped((prev) => !prev); // Allow manual flipping
  };

  return (
    <div className={`card ${isWrapped ? 'wrapped' : 'unwrapped'}`} onClick={handleToggle}>
      <div className="card-front">
        <div className="present">🎁</div>
      </div>
      <div className="card-back">
        <img src={user.image} alt={`${user.name}'s Wishlist`} className="user-image" />
        <h2>{user.name} 🎁</h2>
        <a href={user.wishlistLink} target="_blank" rel="noopener noreferrer" className="view-link">
          View {user.name}'s Wishlist
        </a>
      </div>
    </div>
  );
};

export default WishlistCard;
