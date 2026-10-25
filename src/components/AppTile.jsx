import { useMemo, useState } from 'react';
import FocusCard from './FocusCard.jsx';
import { getAppIcon } from '../lib/launcher.js';

/**
 * Big, centered app tile.
 *
 * Icon source, first that loads wins:
 *   1. the installed app's real icon from the Android wrapper (getAppIcon)
 *   2. ./logos/<id>.svg  (drop licensed files into public/logos/)
 *   3. ./logos/<id>.png
 *   4. a large glyph on a brand-colored plate (always works)
 */
function useIconSource(app) {
  const candidates = useMemo(() => {
    const list = [];
    const native = getAppIcon(app.pkg);
    if (native) list.push(native);
    list.push(`./logos/${app.id}.svg`, `./logos/${app.id}.png`);
    return list;
  }, [app.id, app.pkg]);

  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  return {
    src: candidates[index],
    loaded,
    onLoad: () => setLoaded(true),
    onError: () => {
      setLoaded(false);
      setIndex((i) => i + 1);
    },
  };
}

export default function AppTile({ app, focused, activation, onHover }) {
  const { Icon, tint } = app;
  const icon = useIconSource(app);

  return (
    <FocusCard
      id={app.id}
      label={app.name}
      focused={focused}
      activation={activation}
      onHover={onHover}
      className="flex aspect-[4/3.5] flex-col items-center justify-center gap-5 rounded-[2rem]"
    >
      {/* brand-colored atmosphere behind the icon */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: focused ? 1 : 0.55,
          background: `radial-gradient(90% 75% at 50% 38%, rgb(${tint} / 0.42), transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: 'linear-gradient(to top, rgb(0 0 0 / 0.55), transparent)' }}
      />

      {/* icon plate */}
      <div className="relative grid h-36 w-36 place-items-center">
        {!icon.loaded && (
          <div
            className="absolute inset-0 grid place-items-center rounded-[2.1rem]"
            style={{
              background: `linear-gradient(145deg, rgb(${tint}) 0%, rgb(${tint} / 0.55) 100%)`,
              boxShadow: `0 18px 40px -12px rgb(${tint} / 0.65), inset 0 1px 0 rgb(255 255 255 / 0.35), inset 0 -10px 24px rgb(0 0 0 / 0.18)`,
            }}
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-[2.1rem]"
              style={{ background: 'linear-gradient(160deg, rgb(255 255 255 / 0.28), transparent 45%)' }}
            />
            <Icon className="relative h-[4.5rem] w-[4.5rem] text-white drop-shadow-lg" strokeWidth={1.5} />
          </div>
        )}
        {icon.src && (
          <img
            src={icon.src}
            alt=""
            decoding="async"
            onLoad={icon.onLoad}
            onError={icon.onError}
            className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.55)] transition-opacity duration-300"
            style={{ opacity: icon.loaded ? 1 : 0 }}
          />
        )}
      </div>

      <span className="relative text-xl font-normal tracking-wide text-white/90">{app.name}</span>
    </FocusCard>
  );
}
