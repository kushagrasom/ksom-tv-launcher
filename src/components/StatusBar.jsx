import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Bluetooth, SlidersHorizontal } from 'lucide-react';
import FocusCard from './FocusCard.jsx';
import WeatherWidget from './WeatherWidget.jsx';
import { STATUS_ACTIONS } from '../config/apps.js';
import { isBluetoothOn } from '../lib/launcher.js';

export default function StatusBar({ row, focus, activation, onHover }) {
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [bt, setBt] = useState(isBluetoothOn);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    const poll = setInterval(() => setBt(isBluetoothOn()), 10_000);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
      clearInterval(poll);
    };
  }, []);

  const icons = {
    wifi: online ? Wifi : WifiOff,
    bluetooth: Bluetooth,
    'quick-settings': SlidersHorizontal,
  };
  const dim = { wifi: !online, bluetooth: !bt };

  return (
    <div className="flex items-center gap-5">
      <WeatherWidget />
      <div className="flex items-center gap-3">
        {STATUS_ACTIONS.map((item, col) => {
          const Icon = icons[item.id];
          return (
            <FocusCard
              key={item.id}
              id={item.id}
              label={item.name}
              focused={focus.row === row && focus.col === col}
              activation={activation}
              onHover={() => onHover({ row, col })}
              className="grid h-16 w-16 place-items-center rounded-2xl"
            >
              <Icon
                className={`h-7 w-7 transition-opacity duration-300 ${dim[item.id] ? 'opacity-35' : 'opacity-90'}`}
                strokeWidth={1.5}
              />
            </FocusCard>
          );
        })}
      </div>
    </div>
  );
}
