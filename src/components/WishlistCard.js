import React from 'react';

const WishlistCard = ({ user }) => {
  return (
    <div className="card">
      <img src={user.image} alt={`${user.name}'s Wishlist`} />
      <h2>{user.name} 🎁</h2>
      <a
        href={user.wishlistLink}
        target="_blank"
        rel="noopener noreferrer"
        className="view-link"
      >
        View {user.name}'s Wishlist
      </a>
    </div>
  );
};

export default WishlistCard;
