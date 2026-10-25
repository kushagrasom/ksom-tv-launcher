import { useEffect, useRef, useState } from 'react';

/**
 * Shared focusable surface: scale + glow when focused, ripple on activation.
 * `activation` is { id, n } from App; a new `n` for this card's id fires a ripple.
 */
export default function FocusCard({ id, focused, activation, onHover, className = '', children, label }) {
  const [ripples, setRipples] = useState([]);
  const lastN = useRef(activation?.n ?? 0);

  useEffect(() => {
    if (!activation || activation.id !== id || activation.n === lastN.current) return undefined;
    lastN.current = activation.n;
    const key = activation.n;
    setRipples((r) => [...r, key]);
    const t = setTimeout(() => setRipples((r) => r.filter((k) => k !== key)), 750);
    return () => clearTimeout(t);
  }, [activation, id]);

  return (
    <div
      role="button"
      tabIndex={-1}
      aria-label={label}
      aria-pressed={focused}
      data-focused={focused}
      onMouseEnter={onHover}
      className={`tv-focusable ${focused ? 'scale-105' : 'scale-100'} ${className}`}
    >
      {children}
      {ripples.map((k) => (
        <span key={k} className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="tv-ripple animate-ripple" style={{ width: '220%', aspectRatio: '1 / 1' }} />
        </span>
      ))}
    </div>
  );
}
