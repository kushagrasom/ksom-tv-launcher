import { useEffect, useRef, useState } from 'react';
import { BACKGROUNDS, ROTATE_MS, FADE_MS } from '../config/backgrounds.js';

/**
 * One full-screen layer. Mounts transparent, then fades in on the next frame.
 * The CSS "art" scene is always rendered underneath; the image fades in over
 * it once loaded, and silently stays hidden if it fails.
 */
function Layer({ theme, visible }) {
  const [imgReady, setImgReady] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: visible && show ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease-in-out`,
        willChange: 'opacity',
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ background: theme.art }} />
      <img
        src={theme.image}
        alt=""
        decoding="async"
        onLoad={() => setImgReady(true)}
        onError={() => setImgReady(false)}
        className="absolute inset-0 h-full w-full animate-drift object-cover"
        style={{
          opacity: imgReady ? 1 : 0,
          transition: 'opacity 800ms ease',
        }}
      />
    </div>
  );
}

/**
 * Cycles through BACKGROUNDS every ROTATE_MS (3 minutes) with a 1.5s crossfade.
 * Calls onThemeChange(theme) so the rest of the UI can adopt the accent color.
 */
export default function BackgroundManager({ onThemeChange }) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(null);
  const clearPrevTimer = useRef(null);

  // Rotation timer.
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((cur) => {
        setPrev(cur);
        return (cur + 1) % BACKGROUNDS.length;
      });
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  // Remove the outgoing layer once its fade-out has finished.
  useEffect(() => {
    if (prev === null) return undefined;
    clearTimeout(clearPrevTimer.current);
    clearPrevTimer.current = setTimeout(() => setPrev(null), FADE_MS + 200);
    return () => clearTimeout(clearPrevTimer.current);
  }, [prev]);

  // Preload the next image so the crossfade never starts on a blank frame.
  useEffect(() => {
    const next = BACKGROUNDS[(index + 1) % BACKGROUNDS.length];
    const img = new Image();
    img.src = next.image;
  }, [index]);

  // Tell the app which theme is active.
  useEffect(() => {
    onThemeChange?.(BACKGROUNDS[index]);
  }, [index, onThemeChange]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-black">
      {/* Same key for a theme in both roles, so the outgoing layer stays
          mounted and its opacity transitions 1 -> 0 instead of popping out. */}
      {prev !== null && prev !== index && (
        <Layer key={BACKGROUNDS[prev].id} theme={BACKGROUNDS[prev]} visible={false} />
      )}
      <Layer key={BACKGROUNDS[index].id} theme={BACKGROUNDS[index]} visible />

      {/* Readability scrims: keep text and cards crisp over any artwork. */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/70 to-transparent" />
    </div>
  );
}
