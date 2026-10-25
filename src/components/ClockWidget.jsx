import { useEffect, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

function snapshot() {
  const d = new Date();
  const h24 = d.getHours();
  const h12 = h24 % 12 || 12;
  return {
    time: `${h12}:${pad(d.getMinutes())}`,
    meridiem: h24 >= 12 ? 'PM' : 'AM',
    date: d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }),
  };
}

export default function ClockWidget() {
  const [now, setNow] = useState(snapshot);

  useEffect(() => {
    // Tick once a second; React skips re-rendering unless the minute changed.
    const id = setInterval(() => {
      const next = snapshot();
      setNow((cur) => (cur.time === next.time && cur.meridiem === next.meridiem && cur.date === next.date ? cur : next));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="select-none">
      <div className="flex items-end gap-4 leading-none">
        <span
          className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-[9rem] font-thin tracking-tight tabular-nums text-transparent"
          style={{ WebkitTextFillColor: 'transparent' }}
        >
          {now.time}
        </span>
        <span className="mb-5 text-3xl font-light tracking-[0.2em] text-white/60">{now.meridiem}</span>
      </div>
      <div className="mt-2 pl-2 text-2xl font-light tracking-wide text-white/70">{now.date}</div>
    </div>
  );
}
