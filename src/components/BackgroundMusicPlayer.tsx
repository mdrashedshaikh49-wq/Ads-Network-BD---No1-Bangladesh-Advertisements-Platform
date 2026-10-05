import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX, Play, Pause, Sliders, Upload, Sparkles, X, RotateCcw } from 'lucide-react';

interface BackgroundMusicPlayerProps {
  initialTrackUrl?: string;
}

export default function BackgroundMusicPlayer({ initialTrackUrl = '/background-music.mp3' }: BackgroundMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4); // pleasant background volume 40%
  const [showControls, setShowControls] = useState(false);
  const [trackUrl, setTrackUrl] = useState(initialTrackUrl);
  const [trackName, setTrackName] = useState('Ads Network কর্পোরেট ব্যাকগ্রাউন্ড মিউজিক');
  const wasPlayingBeforeVideoRef = useRef(false);

  // Initialize audio and handle browser Autoplay policies
  useEffect(() => {
    const audio = new Audio(trackUrl);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    const startPlayback = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          cleanupInteractions();
        })
        .catch((err) => {
          console.log('[BG Music] Autoplay waiting for user gesture:', err.message);
        });
    };

    // Attempt autoplay immediately
    startPlayback();

    // Browser Autoplay Policy: if blocked initially, play on very first user interaction anywhere on the page
    const userInteractionEvents = ['click', 'touchstart', 'keydown', 'scroll'];
    const onUserInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        startPlayback();
      }
    };

    const cleanupInteractions = () => {
      userInteractionEvents.forEach((evt) => {
        window.removeEventListener(evt, onUserInteraction);
      });
    };

    userInteractionEvents.forEach((evt) => {
      window.addEventListener(evt, onUserInteraction, { once: false, passive: true });
    });

    // Listen for sponsored video playback events to politely pause BG music
    const handleVideoPlaying = () => {
      if (audioRef.current && !audioRef.current.paused) {
        wasPlayingBeforeVideoRef.current = true;
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    const handleVideoPaused = () => {
      if (audioRef.current && wasPlayingBeforeVideoRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
        wasPlayingBeforeVideoRef.current = false;
      }
    };

    window.addEventListener('watch2earn:video-playing', handleVideoPlaying);
    window.addEventListener('watch2earn:video-paused', handleVideoPaused);

    return () => {
      cleanupInteractions();
      window.removeEventListener('watch2earn:video-playing', handleVideoPlaying);
      window.removeEventListener('watch2earn:video-paused', handleVideoPaused);
      audio.pause();
      audio.src = '';
    };
  }, [trackUrl]);

  // Sync volume & mute changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error('Play failed:', e));
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setTrackUrl(objectUrl);
      setTrackName(file.name.replace(/\.[^/.]+$/, ''));
      if (audioRef.current) {
        audioRef.current.src = objectUrl;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error(err));
      }
    }
  };

  return (
    <>
      {/* Floating Mini Background Music Capsule (Bottom Left) */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2 select-none">
        
        {/* Expanded Controller Panel */}
        {showControls && (
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700/60 w-72 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Music className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-100">ব্যাকগ্রাউন্ড মিউজিক</h4>
                  <p className="text-[10px] text-emerald-400 font-medium">অটোমেটিক ব্যাকগ্রাউন্ড প্লেয়ার</p>
                </div>
              </div>
              <button 
                onClick={() => setShowControls(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Track Info */}
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40 mb-3 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shrink-0 shadow-inner">
                {isPlaying ? <Music className="w-5 h-5 animate-bounce" /> : <Pause className="w-5 h-5" />}
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-slate-200 truncate">{trackName}</p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                  {isPlaying ? 'এখন বাজছে...' : 'মিউজিক পজ করা আছে'}
                </p>
              </div>
            </div>

            {/* Play/Pause & Volume Slider Controls */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                
                <div className="flex-1 flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/40">
                  <button onClick={toggleMute} className="text-slate-300 hover:text-white cursor-pointer">
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-400 min-w-[28px] text-right">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              </div>

              {/* Upload Custom Audio File Button */}
              <label className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-[11px] font-bold rounded-xl border border-slate-700 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>নিজের পছন্দের মিউজিক আপলোড করুন</span>
                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleCustomAudioUpload}
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        )}

        {/* Compact Floating Audio Capsule */}
        <div className="flex items-center bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md text-white rounded-full p-1.5 pr-3 shadow-xl border border-slate-700/60 transition-all hover:scale-105 group">
          <button
            onClick={togglePlay}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
              isPlaying 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold' 
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isPlaying ? 'মিউজিক পজ করুন' : 'মিউজিক চালু করুন'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>

          {/* Equalizer Wave Bars + Status */}
          <div 
            onClick={() => setShowControls(!showControls)}
            className="flex items-center gap-2 mx-2 cursor-pointer"
            title="মিউজিক কন্ট্রোল ওপেন করুন"
          >
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-4 w-4">
                <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2"></span>
                <span className="w-1 bg-teal-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-4"></span>
                <span className="w-1 bg-emerald-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3"></span>
                <span className="w-1 bg-teal-300 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-4.5"></span>
              </div>
            ) : (
              <Music className="w-4 h-4 text-slate-400" />
            )}

            <div className="flex flex-col text-left">
              <span className="text-[11px] font-black leading-tight text-slate-100 flex items-center gap-1">
                মিউজিক {isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                {isPlaying ? 'চালু আছে' : 'বন্ধ আছে'}
              </span>
            </div>
          </div>

          {/* Controls toggle button */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            title="সাউন্ড ও অপশন"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </>
  );
}
