import { Clapperboard, Play, Film, Music, Tv, Popcorn, Settings, Cast, Cable, FolderOpen } from 'lucide-react';

// `pkg` is the Android package name the native wrapper launches.
// Verify on the device with:  adb shell pm list packages | grep <name>
// `url` is the browser fallback when running outside the Android wrapper.
export const APPS = [
  { id: 'netflix', name: 'Netflix', Icon: Clapperboard, tint: '229 9 20', pkg: 'com.netflix.ninja', url: 'https://www.netflix.com' },
  { id: 'youtube', name: 'YouTube', Icon: Play, tint: '255 48 48', pkg: 'com.google.android.youtube.tv', url: 'https://www.youtube.com/tv' },
  { id: 'prime', name: 'Prime Video', Icon: Film, tint: '0 168 225', pkg: 'com.amazon.amazonvideo.livingroom', url: 'https://www.primevideo.com' },
  { id: 'spotify', name: 'Spotify', Icon: Music, tint: '30 215 96', pkg: 'com.spotify.tv.android', url: 'https://open.spotify.com' },
  { id: 'appletv', name: 'Apple TV', Icon: Tv, tint: '220 220 230', pkg: 'com.apple.atve.androidtv.appletv', url: 'https://tv.apple.com' },
  { id: 'plex', name: 'Plex', Icon: Popcorn, tint: '229 160 13', pkg: 'com.plexapp.android', url: 'https://app.plex.tv' },
];

export const UTILITIES = [
  { id: 'settings', name: 'Settings', Icon: Settings, action: 'settings' },
  { id: 'cast', name: 'Cast', Icon: Cast, action: 'cast' },
  { id: 'input', name: 'Inputs', Icon: Cable, action: 'input' },
  { id: 'files', name: 'Files', Icon: FolderOpen, action: 'files' },
];

// Focusable controls in the top status bar (row 0).
export const STATUS_ACTIONS = [
  { id: 'wifi', name: 'Network', action: 'wifi' },
  { id: 'bluetooth', name: 'Bluetooth', action: 'bluetooth' },
  { id: 'quick-settings', name: 'Quick settings', action: 'settings' },
];
