import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'AUDIO_STREAM_01',
    artist: 'UNKNOWN_ENTITY',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    textColor: 'text-cyan-glitch',
    viaColor: 'via-cyan-glitch',
  },
  {
    id: 2,
    title: 'AUDIO_STREAM_02',
    artist: 'CORRUPTED_SECTOR',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    textColor: 'text-magenta-glitch',
    viaColor: 'via-magenta-glitch',
  },
  {
    id: 3,
    title: 'AUDIO_STREAM_03',
    artist: 'VOID_NOISE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    textColor: 'text-white',
    viaColor: 'via-white',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => {
        // Autoplay might be blocked
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleTrackEnded = () => {
    playNext();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-black border-2 border-magenta-glitch p-4 relative overflow-hidden font-mono uppercase">
      {/* Decorative neon line */}
      <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent ${currentTrack.viaColor} to-transparent opacity-80`} />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
        <div className="flex flex-col">
          <h3 className={`font-bold text-2xl ${currentTrack.textColor} truncate max-w-[200px] sm:max-w-[250px]`}>
            {currentTrack.title}
          </h3>
          <p className="text-gray-500 text-sm">SRC: {currentTrack.artist}</p>
        </div>
        
        {/* Visualizer bars (fake) */}
        <div className="flex items-end space-x-1 h-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2 bg-current ${currentTrack.textColor} ${isPlaying ? '' : 'h-1'}`}
              style={{
                height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '4px',
                animationDuration: `${0.1 + Math.random() * 0.2}s`,
                transition: 'height 0.05s steps(2)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 flex items-center space-x-3 text-sm text-gray-500">
        <span>{formatTime(progress)}</span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleSeek}
          className="flex-1 h-2 bg-gray-900 appearance-none cursor-pointer accent-magenta-glitch border border-gray-700"
        />
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 border border-gray-800 p-1">
          <button onClick={() => setIsMuted(!isMuted)} className="text-gray-500 hover:text-cyan-glitch transition-none p-1">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-16 h-2 bg-gray-900 appearance-none cursor-pointer accent-cyan-glitch"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={playPrev} className="text-gray-500 hover:text-magenta-glitch transition-none p-2 border border-transparent hover:border-magenta-glitch">
            <SkipBack size={24} />
          </button>
          <button
            onClick={togglePlay}
            className={`p-2 bg-black border-2 ${isPlaying ? 'border-cyan-glitch text-cyan-glitch' : 'border-magenta-glitch text-magenta-glitch'} hover:bg-gray-900 transition-none`}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          <button onClick={playNext} className="text-gray-500 hover:text-magenta-glitch transition-none p-2 border border-transparent hover:border-magenta-glitch">
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
