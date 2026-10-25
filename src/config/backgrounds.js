// Background pool. Rotation interval is exactly 3 minutes.
export const ROTATE_MS = 180_000;
export const FADE_MS = 1500;

/**
 * Each theme has:
 *  - image:  path to artwork. Drop your own licensed, TV-sized (1920x1080 or
 *            3840x2160) files into /public/backgrounds/ using these names, or
 *            replace the value with any https URL you have rights to use.
 *  - accent: "R G B" used for the focus glow while this background is active.
 *  - art:    CSS gradient scene shown underneath the image. It is the visual
 *            fallback, so the launcher always looks right even if an image is
 *            missing or the network is down.
 */
export const BACKGROUNDS = [
  {
    id: 'doom',
    label: 'Dr. Doom',
    mood: 'Dark cosmic sorcery',
    image: './backgrounds/doom.jpg',
    accent: '52 211 153',
    art: [
      'radial-gradient(60% 55% at 70% 30%, rgb(16 185 129 / 0.35), transparent 70%)',
      'radial-gradient(45% 45% at 20% 80%, rgb(20 83 45 / 0.5), transparent 70%)',
      'linear-gradient(160deg, #03110c 0%, #05070a 55%, #000 100%)',
    ].join(','),
  },
  {
    id: 'spiderman',
    label: 'Spider-Man',
    mood: 'Neon city rooftops',
    image: './backgrounds/spiderman.jpg',
    accent: '244 63 94',
    art: [
      'radial-gradient(50% 50% at 25% 35%, rgb(244 63 94 / 0.38), transparent 70%)',
      'radial-gradient(55% 55% at 80% 70%, rgb(59 130 246 / 0.35), transparent 70%)',
      'linear-gradient(180deg, #0a0614 0%, #07070f 60%, #000 100%)',
    ].join(','),
  },
  {
    id: 'strange',
    label: 'Doctor Strange',
    mood: 'Multiversal portal',
    image: './backgrounds/strange.jpg',
    accent: '251 146 60',
    art: [
      'radial-gradient(38% 38% at 62% 42%, transparent 55%, rgb(251 146 60 / 0.5) 60%, transparent 68%)',
      'radial-gradient(30% 30% at 62% 42%, transparent 60%, rgb(253 186 116 / 0.35) 64%, transparent 70%)',
      'radial-gradient(70% 60% at 62% 42%, rgb(120 53 15 / 0.35), transparent 75%)',
      'linear-gradient(160deg, #120804 0%, #070504 60%, #000 100%)',
    ].join(','),
  },
  {
    id: 'thor',
    label: 'Thor',
    mood: 'Lightning storm',
    image: './backgrounds/thor.jpg',
    accent: '96 165 250',
    art: [
      'radial-gradient(40% 50% at 55% 20%, rgb(147 197 253 / 0.45), transparent 70%)',
      'radial-gradient(60% 50% at 20% 90%, rgb(30 58 138 / 0.5), transparent 70%)',
      'linear-gradient(180deg, #06101f 0%, #050912 60%, #000 100%)',
    ].join(','),
  },
  {
    id: 'ironman',
    label: 'Iron Man',
    mood: 'Tech HUD',
    image: './backgrounds/ironman.jpg',
    accent: '34 211 238',
    art: [
      'repeating-linear-gradient(0deg, rgb(34 211 238 / 0.05) 0 1px, transparent 1px 48px)',
      'repeating-linear-gradient(90deg, rgb(34 211 238 / 0.05) 0 1px, transparent 1px 48px)',
      'radial-gradient(35% 35% at 70% 45%, rgb(34 211 238 / 0.35), transparent 70%)',
      'radial-gradient(50% 50% at 25% 85%, rgb(220 38 38 / 0.28), transparent 70%)',
      'linear-gradient(160deg, #030b10 0%, #04070a 60%, #000 100%)',
    ].join(','),
  },
  {
    id: 'panther',
    label: 'Black Panther',
    mood: 'Vibranium purple',
    image: './backgrounds/panther.jpg',
    accent: '168 85 247',
    art: [
      'radial-gradient(50% 50% at 72% 35%, rgb(168 85 247 / 0.4), transparent 70%)',
      'radial-gradient(45% 45% at 15% 80%, rgb(88 28 135 / 0.5), transparent 70%)',
      'linear-gradient(165deg, #0c0516 0%, #060410 60%, #000 100%)',
    ].join(','),
  },
];
