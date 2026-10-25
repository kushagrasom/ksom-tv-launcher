import React, { useState, useEffect, useCallback } from 'react';
import { Wifi, Settings, Plus, Play, RefreshCw, Sparkles, Volume2 } from 'lucide-react';

const WALLPAPERS = [
  { id: 'doom-green', url: '/doctor-doom-green-3840x2160-27313_2.jpg', fallback: '/backgrounds/doom-green.jpg', accent: '#10b981' },
  { id: 'doom-mist', url: '/26922_2.jpg', fallback: '/backgrounds/doom-mist.jpg', accent: '#34d399' },
  { id: 'spiderman', url: '/ftmm1gw6ic8h1_2.jpeg', fallback: '/backgrounds/spiderman.jpg', accent: '#ef4444' },
  { id: 'thor-doom', url: '/b388ca82-701f-47d3-b9eb-99cc3236d964_2.jpeg', fallback: '/backgrounds/thor-doom.jpg', accent: '#3b82f6' },
  { id: 'strange', url: '/7430_2.jpg', fallback: '/backgrounds/strange.jpg', accent: '#f97316' },
  { id: 'loki', url: '/618b6356fa013ad6ce136b296c58b050_2.jpg', fallback: '/backgrounds/loki.jpg', accent: '#eab308' }
];

const INITIAL_APPS = [
  { id: 'netflix', name: 'Netflix', pkg: 'com.netflix.ninja', iconUrl: '/logos/netflix.png', color: '#E50914', type: 'svg' },
  { id: 'youtube', name: 'YouTube', pkg: 'com.google.android.youtube.tv', iconUrl: '/logos/youtube.png', color: '#FF0000', type: 'svg' },
  { id: 'prime', name: 'Prime Video', pkg: 'com.amazon.amazonvideo.livingroom', iconUrl: '/logos/prime.png', color: '#00A8E1', type: 'svg' },
  { id: 'hotstar', name: 'JioHotstar', pkg: 'in.startv.hotstar', iconUrl: '/logos/disney.png', color: '#1e3a8a', type: 'svg' },
  { id: 'zee5', name: 'ZEE5', pkg: 'com.graymatrix.did', iconUrl: '/5f0d98eb2ed7fea22349286c7a6cd9_2.webp', color: '#000000', type: 'img' },
  { id: 'appletv', name: 'Apple TV', pkg: 'com.apple.atve.androidtv.appletv', iconUrl: '/831330_2.png', color: '#000000', type: 'img' },
  { id: 'airtel', name: 'Airtel Xstream', pkg: 'tv.accedo.airtel.wynk', iconUrl: '/AirtelXstream_logo_2.jpg', color: '#ffffff', type: 'img' },
  { id: 'spotify', name: 'Spotify', pkg: 'com.spotify.tv.android', iconUrl: '/logos/spotify.png', color: '#1DB954', type: 'svg' },
  { id: 'settings', name: 'Settings', pkg: 'com.android.tv.settings', iconUrl: '', color: '#52525b', type: 'settings' }
];

export default function App() {
  const [wallIdx, setWallIdx] = useState(0);
  const [apps, setApps] = useState(INITIAL_APPS);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [booted, setBooted] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  // Fast 450ms boot reveal so background image shines first, then dock animates in
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 450);
    return () => clearTimeout(t);
  }, []);

  // Clock update
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  // 3-Minute (180,000ms) Automatic Marvel Wallpaper Rotation
  useEffect(() => {
    const rot = setInterval(() => {
      setWallIdx((prev) => (prev + 1) % WALLPAPERS.length);
    }, 180000);
    return () => clearInterval(rot);
  }, []);

  // Auto-Fetch Installed TV Apps & Icons from Native Android Bridge (PackageManager)
  const syncInstalledTvApps = useCallback(() => {
    if (window.AndroidBridge && typeof window.AndroidBridge.getInstalledTvApps === 'function') {
      try {
        const rawJson = window.AndroidBridge.getInstalledTvApps();
        const installedList = JSON.parse(rawJson);
        if (Array.isArray(installedList) && installedList.length > 0) {
          setApps((prev) => {
            const existingPkgs = new Set(prev.map((a) => a.pkg));
            const newDetected = installedList
              .filter((item) => !existingPkgs.has(item.packageName))
              .map((item) => ({
                id: item.packageName,
                name: item.appName,
                pkg: item.packageName,
                iconUrl: item.iconBase64, // Extracted directly from Android PackageManager!
                color: '#18181b',
                type: 'img'
              }));
            return [...prev, ...newDetected];
          });
        }
      } catch (e) {
        console.error('Failed to sync Android TV apps:', e);
      }
    }
  }, []);

  useEffect(() => {
    syncInstalledTvApps();
    window.onTvPackageChanged = syncInstalledTvApps;
  }, [syncInstalledTvApps]);

  const launchApp = (app) => {
    if (window.AndroidBridge && typeof window.AndroidBridge.launchApp === 'function') {
      window.AndroidBridge.launchApp(app.pkg);
    } else {
      console.log('Launching package:', app.pkg);
    }
  };

  // D-Pad Remote Navigation (Left, Right, Enter)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedIdx((prev) => (prev + 1) % apps.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedIdx((prev) => (prev - 1 + apps.length) % apps.length);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        launchApp(apps[focusedIdx]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [apps, focusedIdx]);

  const activeWall = WALLPAPERS[wallIdx];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans">
      {/* Full-Screen Unobstructed Marvel Wallpaper Crossfade */}
      {WALLPAPERS.map((w, idx) => (
        <div
          key={w.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            idx === wallIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{
            backgroundImage: `url(${w.url}), url(${w.fallback})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transitionProperty: 'opacity, transform',
            transitionDuration: '1200ms'
          }}
        />
      ))}

      {/* Subtle Bottom Gradient Vignette Only Behind Dock so Artwork Shines */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Minimal Top-Right Status Pill */}
      <div
        className={`absolute top-8 right-10 flex items-center gap-5 px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 transition-all duration-500 ${
          booted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <Wifi className="w-4 h-4 text-emerald-400" />
        <span className="text-lg font-medium tracking-wider">{timeStr}</span>
      </div>

      {/* Ultra-Minimal Floating Glass App Dock */}
      <div
        className={`absolute inset-x-0 bottom-10 flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          booted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="flex items-center gap-5 px-8 py-5 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/10 shadow-2xl max-w-[92vw] overflow-x-auto no-scrollbar">
          {apps.map((app, idx) => {
            const isFocused = idx === focusedIdx;
            return (
              <button
                key={app.id}
                onClick={() => {
                  setFocusedIdx(idx);
                  launchApp(app);
                }}
                onFocus={() => setFocusedIdx(idx)}
                className={`group relative flex flex-col items-center justify-center w-28 h-28 rounded-2xl transition-all duration-200 outline-none shrink-0 overflow-hidden ${
                  isFocused
                    ? 'scale-110 -translate-y-2 ring-2 ring-white shadow-[0_12px_35px_rgba(255,255,255,0.28)] bg-white/15'
                    : 'scale-100 opacity-80 hover:opacity-100 bg-white/5 border border-white/10'
                }`}
              >
                {app.type === 'img' ? (
                  <img
                    src={app.iconUrl}
                    alt={app.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : app.type === 'settings' ? (
                  <Settings className="w-11 h-11 text-white/90" />
                ) : (
                  <span className="text-xl font-bold tracking-tight text-white">
                    {app.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
