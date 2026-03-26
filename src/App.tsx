/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-4 font-mono relative overflow-hidden uppercase">
      {/* Glitch / Static Overlays */}
      <div className="absolute inset-0 z-50 pointer-events-none scanlines"></div>
      <div className="absolute inset-0 z-0 pointer-events-none static-bg"></div>

      {/* Header / Score */}
      <header className="z-10 w-full max-w-md flex justify-between items-center mt-4 mb-8 border-b-4 border-cyan-glitch pb-2 tear-effect">
        <h1 className="text-4xl font-bold tracking-tighter glitch-text" data-text="SYS.SNAKE_PRTCL">
          SYS.SNAKE_PRTCL
        </h1>
        <div className="bg-black border-2 border-magenta-glitch px-4 py-1">
          <span className="text-magenta-glitch text-sm mr-2">DATA_YIELD:</span>
          <span className="text-2xl font-bold text-cyan-glitch">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
      </header>

      {/* Game Area */}
      <main className="z-10 flex-1 flex items-center justify-center w-full mb-8 tear-effect" style={{ animationDelay: '1s' }}>
        <SnakeGame onScoreChange={setScore} />
      </main>

      {/* Music Player */}
      <footer className="z-10 w-full flex justify-center mb-4 tear-effect" style={{ animationDelay: '2s' }}>
        <MusicPlayer />
      </footer>
    </div>
  );
}
