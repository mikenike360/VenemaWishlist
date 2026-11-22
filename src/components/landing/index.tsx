import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './scene/Scene';
import { LandingStyles } from './ui/LandingStyles';
import { PresentPanel } from './ui/PresentPanel';
import { PeopleDrawer } from './ui/PeopleDrawer';
import { FamilyFinder } from './ui/FamilyFinder';
import { OrbitPad } from './ui/OrbitPad';
import { OrbitHold } from './scene/CameraControls';
import Footer from '../Footer';
import { LandingChrome } from './ui/LandingChrome';
import { supabase } from '../../lib/supabase';
import { PresentPerson, profileToPresent, pilePosition } from '../../lib/profiles';
import { homeCameraFov, homeCameraPosition } from '../../lib/roomLayout';
import backgroundMusic from '../../assets/audio/christmas_chill.mp3';

const MUSIC_VOLUME_KEY = 'venema.music.volume';
const MUSIC_MUTED_KEY = 'venema.music.muted';

function readStoredVolume(): number {
  try {
    const raw = localStorage.getItem(MUSIC_VOLUME_KEY);
    if (raw == null) return 0.5;
    const value = Number(raw);
    return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0.5;
  } catch {
    return 0.5;
  }
}

function readStoredMuted(): boolean {
  try {
    return localStorage.getItem(MUSIC_MUTED_KEY) === '1';
  } catch {
    return false;
  }
}

const LandingPage: React.FC = () => {
  // Music state — prefer playing; browsers may block until a gesture.
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(readStoredVolume);
  const [muted, setMuted] = useState(readStoredMuted);
  const volumeBeforeMute = useRef(readStoredVolume());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockAttempted = useRef(false);
  const [people, setPeople] = useState<PresentPerson[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PresentPerson | null>(null);
  const [focus, setFocus] = useState<[number, number, number] | null>(null);
  const [homeRequest, setHomeRequest] = useState(0);
  const [showPeople, setShowPeople] = useState(false);
  const orbit = useRef<OrbitHold>({ left: false, right: false, up: false, down: false });
  const [cameraBoot] = useState(() => ({
    position: homeCameraPosition(),
    fov: homeCameraFov(),
  }));

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
      audioRef.current.preload = 'auto';
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(MUSIC_VOLUME_KEY, String(volume));
      localStorage.setItem(MUSIC_MUTED_KEY, muted ? '1' : '0');
    } catch {
      // ignore quota / private mode
    }
  }, [volume, muted]);

  // Effect to handle music play/pause and volume
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = muted ? 0 : volume;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked — wait for first user gesture (below).
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, volume, muted]);

  // If autoplay was blocked, start music on the first pointer/key interaction.
  useEffect(() => {
    if (isPlaying) return;

    const unlock = () => {
      if (unlockAttempted.current) return;
      unlockAttempted.current = true;
      setIsPlaying(true);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [isPlaying]);

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
    setIsPlaying((playing) => !playing);
  };

  const toggleMute = () => {
    setMuted((wasMuted) => {
      if (wasMuted) {
        const restore = volumeBeforeMute.current > 0.01 ? volumeBeforeMute.current : 0.5;
        setVolume(restore);
        return false;
      }
      volumeBeforeMute.current = volume > 0.01 ? volume : volumeBeforeMute.current;
      return true;
    });
  };

  const handleVolume = (next: number) => {
    setVolume(next);
    if (next > 0.001) {
      setMuted(false);
      volumeBeforeMute.current = next;
    } else {
      setMuted(true);
    }
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
    <div className="relative h-screen overflow-hidden bg-[#1a100c]">
      {/* Full-bleed living room */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: cameraBoot.position, fov: cameraBoot.fov }}
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
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

      <LandingChrome
        isPlaying={isPlaying}
        volume={volume}
        muted={muted}
        toggleMusic={toggleMusic}
        toggleMute={toggleMute}
        setVolume={handleVolume}
      />

      <div className="pointer-events-none absolute left-0 top-14 z-20 w-full max-w-md sm:top-4">
        <FamilyFinder
          people={people}
          query={query}
          onQueryChange={setQuery}
          onPick={openPerson}
          onOpenPeople={() => setShowPeople((open) => !open)}
          peopleOpen={showPeople}
        />
      </div>

      {loadError && (
        <p className="pointer-events-none absolute left-3 top-28 z-20 text-sm font-semibold text-[#f3ead7] drop-shadow sm:top-20">
          {loadError}
        </p>
      )}

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

      <LandingStyles />
      <div className="absolute inset-x-0 bottom-0 z-20">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;

