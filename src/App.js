//App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import WishlistCard from './components/WishlistCard';
import Snowfall from './components/Snowfall';
import backgroundMusic from './assets/audio/jingle_bells.mp3';
import michaelImage from './assets/images/michael.jpg';
import amandaImage from './assets/images/amanda.jpg';
import joeyImage from './assets/images/joey.jpg';
import aliyaImage from './assets/images/aliya.jpg';
import eliImage from './assets/images/eli.jpg';
import ellaImage from './assets/images/ella.jpg';
import micahImage from './assets/images/micah.jpg';
import carrieImage from './assets/images/carrie.jpg'
import rockImage from './assets/images/rock.jpg'
import kaylaImage from './assets/images/kayla.jpg'
import mattImage from './assets/images/matt.jpg'
import sonnyImage from './assets/images/sonny.jpg'
import mikeImage from './assets/images/mike.jpg'
import barbImage from './assets/images/barb.jpg'
import ashleyImage from './assets/images/ashley.jpg'
import brittanyImage from './assets/images/brittany.jpg'
import wendyImage from './assets/images/wendy.jpg'
import karlImage from './assets/images/karl.jpg'
import marilynImage from './assets/images/marilyn.jpg'
import bobImage from './assets/images/bob.jpg'
import nickImage from './assets/images/nick.jpg'
import nateImage from './assets/images/nate.jpg'
import chadImage from './assets/images/chad.jpg'
import johnImage from './assets/images/john.jpg'
import nolleImage from './assets/images/nolle.jpg'
import roenImage from './assets/images/roen.jpg'
import toshImage from './assets/images/tosh.jpg'


// Shuffle function
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
  { name: 'Carrie', image: carrieImage, wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/3FHZZVM2ZMVKM/ref=cm_go_nav_hz' },
  { name: 'Rock', image: rockImage, wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/10CGYA2B0I24Z?ref_=wl_share' },
  { name: 'Kayla', image: kaylaImage, wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/U0BNRXA6EMT4?ref_=wl_share' },
  { name: 'Matt', image: mattImage, wishlistLink: 'https://www.amazon.com/registry/wishlist/2B91OR7T2SP7A/ref=cm_sw_r_cp_ep_ws_-8hjAb0KFHPS2' },
  { name: 'Sonny', image: sonnyImage, wishlistLink: 'https://www.amazon.com/registry/wishlist/2JPFI5AG5ATOG/ref=cm_sw_r_cp_ep_ws_fFniAbJ9QVCVD' },
  { name: 'Barbara', image: barbImage, wishlistLink: 'https://www.amazon.com/' },
  { name: 'Mike', image: mikeImage, wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/1BGXRVLXFMMTU?ref=cm_sw_sm_r_un_un_1n9lQy3pOvl2W' },
  { name: 'Ashley', image: ashleyImage, wishlistLink: 'https://www.amazon.com/registry/wishlist/QBNVEJLCHZ5T/ref=cm_sw_r_cp_ep_ws_NoyvybR17JHFE' },
  { name: 'Brittany', image: brittanyImage, wishlistLink: 'https://www.amazon.com/registry/wishlist/2LBV3RMDXJWN4/ref=cm_sw_r_cp_ep_ws_ImyvybP71JAZZ' },
  { name: 'Wendy', image: wendyImage, wishlistLink: 'https://www.amazon.com/registry/wishlist/1G0ON3X87IXFO/ref=cm_sw_r_cp_ep_ws_0nyvyb2MF7YW8' },
  { name: 'Karl', image: karlImage, wishlistLink: 'https://www.amazon.com/registry/wishlist/R6KPCB5ERVKZ/ref=cm_sw_r_cp_ep_ws_qcZvyb1YPZ8YG' },
  { name: 'Marilyn', image: marilynImage, wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/YT96AFJS6SPO?ref_=wl_share' },
  { name: 'Bob', image: bobImage, wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/3Q9FSF6634XH3?ref_=wl_share' },
  { name: 'Nick', image: nickImage, wishlistLink: 'https://www.amazon.com/hz/wishlist/ls/3KOIVNWWRFPZ2?ref_=wl_share' },
  { name: 'Nathaniel', image: nateImage, wishlistLink: 'https://www.amazon.com/registry/wishlist/302M6ZBIB14Z6/ref=cm_sw_r_cp_ep_ws_5cZvybFVCMWG7' },
  { name: 'Chad', image: chadImage, wishlistLink: 'https://www.amazon.com/' },
  { name: 'John', image: johnImage, wishlistLink: 'https://www.amazon.com/' },
  { name: 'Roen', image: roenImage, wishlistLink: 'https://www.amazon.com/' },
  { name: 'Nolle', image: nolleImage, wishlistLink: 'https://www.amazon.com/' },
  { name: 'Tosh', image: toshImage, wishlistLink: 'https://www.amazon.com/' },
];

// Shuffle the cards
const shuffledUsers = shuffleArray(users);

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false); // State to track music playback
  const [audio] = useState(new Audio(backgroundMusic)); // Create an audio object
  const [allFlipped, setAllFlipped] = useState(false); // State to track "flip all" toggle

  // Effect to handle music play/pause
  useEffect(() => {
    if (isPlaying) {
      audio.play();
      audio.loop = true; // Enable looping
    } else {
      audio.pause();
    }
  }, [isPlaying, audio]);

  // Toggle music on/off
  const toggleMusic = () => {
    setIsPlaying((prev) => !prev);
  };

  // Toggle flip state for all cards
  const toggleAllFlipped = () => {
    setAllFlipped((prev) => !prev);
  };

  return (
    <div className="App">
      <Snowfall />
      <Header />
      <div className="buttons">
        <button className="music-toggle" onClick={toggleMusic}>
          {isPlaying ? '🔇 Stop Music' : '🔊 Play Music'}
        </button>
        <button className="flip-toggle" onClick={toggleAllFlipped}>
          {allFlipped ? 'Reset Presents!' : 'Open Presents!'}
        </button>
      </div>
      <main>
        <div className="wishlist-grid">
          {shuffledUsers.map((user, index) => (
            <WishlistCard key={index} user={user} isFlipped={allFlipped} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
