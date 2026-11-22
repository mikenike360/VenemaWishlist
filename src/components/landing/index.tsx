import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './scene/Scene';
import { LandingStyles } from './ui/LandingStyles';
import { PresentPanel } from './ui/PresentPanel';
import { PeopleDrawer } from './ui/PeopleDrawer';
import { OrbitPad } from './ui/OrbitPad';
import { OrbitHold } from './scene/CameraControls';
import Header from '../Header';
import Footer from '../Footer';
import { supabase } from '../../lib/supabase';
import { PresentPerson, profileToPresent, pilePosition } from '../../lib/profiles';
import { DEFAULT_CAMERA_POSITION } from '../../lib/roomLayout';
import backgroundMusic from '../../assets/audio/christmas_chill.mp3';

const LandingPage: React.FC = () => {
  // Music state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [people, setPeople] = useState<PresentPerson[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PresentPerson | null>(null);
  const [focus, setFocus] = useState<[number, number, number] | null>(null);
  const [homeRequest, setHomeRequest] = useState(0);
  const [showPeople, setShowPeople] = useState(false);
  const orbit = useRef<OrbitHold>({ left: false, right: false, up: false, down: false });

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return people.filter((person) => person.name.toLowerCase().includes(needle));
  }, [people, query]);

  const openPerson = (person: PresentPerson) => {
    // Open the card without yanking the camera — search still focuses to find gifts.
    setSelected(person);
    setFocus(null);
    setHomeRequest((n) => n + 1);
    setShowPeople(false);
  };

  const closePerson = () => {
    setSelected(null);
    setFocus(null);
    setHomeRequest((n) => n + 1);
  };

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(backgroundMusic);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current.preload = 'auto';
    }
  }, []);

  // Effect to handle music play/pause and volume
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    audio.volume = volume;
    
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Audio is playing successfully
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
          });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, volume]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let cancelled = false;
    const loadPeople = async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('name');
      if (cancelled) return;
      if (error) {
        setLoadError('The family list could not load.');
        setPeople([]);
        return;
      }
      setLoadError(null);
      setPeople((data || []).map(profileToPresent));
    };
    loadPeople();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFocus(null);
      return;
    }
    if (matches.length === 1) {
      const index = people.findIndex((item) => item.id === matches[0].id);
      if (index >= 0) setFocus(pilePosition(index, people.length));
      return;
    }
    setFocus(null);
  }, [matches, people, query]);

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex flex-col">
      {/* Above the full-bleed canvas so play/volume stay usable */}
      <div className="relative z-20">
        <Header
          isPlaying={isPlaying}
          volume={volume}
          toggleMusic={toggleMusic}
          setVolume={setVolume}
        />
      </div>
      <div className="relative z-20 flex flex-wrap items-center gap-2 px-3 pt-2 pointer-events-auto">
        <input
          type="search"
          value={query}
          placeholder="Search the family..."
          aria-label="Search the family"
          className="input input-sm w-full max-w-xs bg-base-100/95"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && matches.length === 1) {
              openPerson(matches[0]);
            }
          }}
        />
        <button type="button" className="btn btn-sm btn-primary" onClick={() => setShowPeople((open) => !open)}>
          People
        </button>
        {loadError && <p className="text-sm font-semibold text-white drop-shadow">{loadError}</p>}
      </div>
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: DEFAULT_CAMERA_POSITION, fov: 48 }} 
          shadows
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Scene
              people={people}
              query={query}
              focus={focus}
              homeRequest={homeRequest}
              onSelect={openPerson}
              onReleaseCamera={() => setFocus(null)}
              orbit={orbit}
            />
          </Suspense>
        </Canvas>
      </div>

      <OrbitPad orbit={orbit} />
      {selected && <PresentPanel person={selected} onClose={closePerson} />}
      {showPeople && (
        <PeopleDrawer
          people={people}
          query={query}
          onPick={openPerson}
          onClose={() => setShowPeople(false)}
        />
      )}

      {/* Custom animations */}
      <LandingStyles />
      <Footer />
    </div>
  );
};

export default LandingPage;

