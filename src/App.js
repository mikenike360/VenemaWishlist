import React from 'react';
import './App.css';
import Header from './components/Header';
import WishlistCard from './components/WishlistCard';
import Snowfall from './components/Snowfall';
import michaelImage from './assets/images/michael.jpg';
import amandaImage from './assets/images/amanda.jpg';
import joeyImage from './assets/images/joey.jpg';
import aliyaImage from './assets/images/aliya.jpg';
import eliImage from './assets/images/eli.jpg';
import ellaImage from './assets/images/ella.jpg';
import micahImage from './assets/images/micah.jpg';

// Shuffle function (move this to the top before it's called)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Data for the wishlist
const users = [
  { name: 'Michael', image: michaelImage, wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/YP3U0JTFQA50?ref_=wl_share' },
  { name: 'Amanda', image: amandaImage, wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/2KYDF3TIJBL0M?ref_=wl_share' },
  { name: 'Joey', image: joeyImage, wishlistLink: 'https://www.amazon.com/registry/wishlist/FW36XQGEIFOD/ref=cm_sw_r_cp_ep_ws_hxBvybZTWJ2XW' },
  { name: 'Aliya', image: aliyaImage, wishlistLink: 'https://www.amazon.com/registry/wishlist/1UJH19QLW22GH/ref=cm_sw_r_cp_ep_ws_pwBvybBH0883T' },
  { name: 'Elijah', image: eliImage, wishlistLink: 'https://www.amazon.com/registry/wishlist/2FJHZEJG9IYAC/ref=cm_sw_r_cp_ep_ws_AvBvybT1JCEZ5' },
  { name: 'Ella', image: ellaImage, wishlistLink: 'https://www.amazon.com/registry/wishlist/14Q6IUHZPL1K5/ref=cm_sw_r_cp_ep_ws_8vmiAbSJ4Z79N' },
  { name: 'Micah', image: micahImage, wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/4YQS7HA1PG4Z?ref_=wl_share' },
];

// Shuffle the cards
const shuffledUsers = shuffleArray(users);

const App = () => {
  return (
    <div className="App">
      <Snowfall />
      <Header />
      <main>
        <div className="wishlist-grid">
          {shuffledUsers.map((user, index) => (
            <WishlistCard key={index} user={user} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;