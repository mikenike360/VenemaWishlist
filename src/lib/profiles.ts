import { Profile, User } from '../types';
import michaelImage from '../assets/images/michael.jpg';
import amandaImage from '../assets/images/amanda.jpg';
import joeyImage from '../assets/images/joey.jpg';
import aliyaImage from '../assets/images/aliya.jpg';
import eliImage from '../assets/images/eli.jpg';
import ellaImage from '../assets/images/ella.jpg';
import micahImage from '../assets/images/micah.jpg';
import carrieImage from '../assets/images/carrie.jpg';
import rockImage from '../assets/images/rock.jpg';
import kaylaImage from '../assets/images/kayla.jpg';
import mattImage from '../assets/images/matt.jpg';
import sonnyImage from '../assets/images/sonny.jpg';
import barbImage from '../assets/images/barb.jpg';
import mikeImage from '../assets/images/mike.jpg';
import ashleyImage from '../assets/images/ashley.jpg';
import brittanyImage from '../assets/images/brittany.jpg';
import wendyImage from '../assets/images/wendy.jpg';
import karlImage from '../assets/images/karl.jpg';
import marilynImage from '../assets/images/marilyn.jpg';
import bobImage from '../assets/images/bob.jpg';
import nickImage from '../assets/images/nick.jpg';
import nateImage from '../assets/images/nate.jpg';
import chadImage from '../assets/images/chad.jpg';
import johnImage from '../assets/images/john.jpg';
import roenImage from '../assets/images/roen.jpg';
import nolleImage from '../assets/images/nolle.jpg';
import toshImage from '../assets/images/tosh.jpg';
import morganImage from '../assets/images/morgan.jpg';

const fallbackImages: Record<string, string> = {
  Michael: michaelImage,
  Amanda: amandaImage,
  Joey: joeyImage,
  Aliya: aliyaImage,
  Elijah: eliImage,
  Ella: ellaImage,
  Micah: micahImage,
  Carrie: carrieImage,
  Rock: rockImage,
  Kayla: kaylaImage,
  Matt: mattImage,
  Sonny: sonnyImage,
  Barbara: barbImage,
  Mike: mikeImage,
  Ashley: ashleyImage,
  Brittany: brittanyImage,
  Wendy: wendyImage,
  Karl: karlImage,
  Marilyn: marilynImage,
  Bob: bobImage,
  Nick: nickImage,
  Nathaniel: nateImage,
  Chad: chadImage,
  John: johnImage,
  Roen: roenImage,
  Noli: nolleImage,
  Tosh: toshImage,
  Morgan: morganImage,
};

export interface PresentPerson extends User {
  id: string;
}

export const profileToUser = (profile: Profile): User => ({
  name: profile.name,
  image: profile.image_url || fallbackImages[profile.name] || '',
  wishlistLink: profile.wishlist_link || 'https://www.amazon.com/',
});

export const profileToPresent = (profile: Profile): PresentPerson => ({
  id: profile.id,
  ...profileToUser(profile),
});

export const RING_RADIUS = 4.7;

export function ringPosition(index: number, count: number): [number, number, number] {
  const angle = count === 0 ? 0 : (index / count) * Math.PI * 2;
  return [Math.sin(angle) * RING_RADIUS, -0.48, Math.cos(angle) * RING_RADIUS];
}
