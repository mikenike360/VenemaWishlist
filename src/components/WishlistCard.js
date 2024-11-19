import React, { useState } from 'react';

const WishlistCard = ({ user }) => {
  const [isWrapped, setIsWrapped] = useState(true);

  const handleToggle = () => {
    setIsWrapped(!isWrapped);
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
