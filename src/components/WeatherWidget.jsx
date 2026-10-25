import { useEffect, useState } from 'react';
import { Sun, Moon, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

// Fallback coordinates when geolocation is unavailable (common in TV WebViews).
const FALLBACK = { lat: 18.5204, lon: 73.8567, name: 'Pune' };
const REFRESH_MS = 15 * 60 * 1000;

// WMO weather codes -> icon + label (https://open-meteo.com/en/docs).
function describe(code, isDay) {
  if (code === 0) return { Icon: isDay ? Sun : Moon, label: 'Clear' };
  if (code <= 2) return { Icon: CloudSun, label: 'Partly cloudy' };
  if (code === 3) return { Icon: Cloud, label: 'Overcast' };
  if (code <= 48) return { Icon: CloudFog, label: 'Fog' };
  if (code <= 57) return { Icon: CloudDrizzle, label: 'Drizzle' };
  if (code <= 67) return { Icon: CloudRain, label: 'Rain' };
  if (code <= 77) return { Icon: CloudSnow, label: 'Snow' };
  if (code <= 82) return { Icon: CloudRain, label: 'Showers' };
  if (code <= 86) return { Icon: CloudSnow, label: 'Snow showers' };
  return { Icon: CloudLightning, label: 'Thunderstorm' };
}

function getCoords() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(FALLBACK);
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude, name: '' }),
      () => resolve(FALLBACK),
      { timeout: 4000, maximumAge: 60 * 60 * 1000 }
    );
  });
}

export default function WeatherWidget() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    let timer;

    async function load() {
      try {
        const { lat, lon, name } = await getCoords();
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          '&current=temperature_2m,weather_code,is_day&timezone=auto';
        const res = await fetch(url);
        if (!res.ok) throw new Error(`weather ${res.status}`);
        const json = await res.json();
        if (!alive) return;
        setData({
          temp: Math.round(json.current.temperature_2m),
          code: json.current.weather_code,
          isDay: json.current.is_day === 1,
          name,
        });
      } catch {
        /* keep the last good reading; try again on the next tick */
      } finally {
        if (alive) timer = setTimeout(load, REFRESH_MS);
      }
    }

    load();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  if (!data) {
    return <div className="h-14 w-40 animate-pulse rounded-2xl bg-white/5" aria-hidden="true" />;
  }

  const { Icon, label } = describe(data.code, data.isDay);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-md">
      <Icon className="h-9 w-9 text-white/90" strokeWidth={1.25} />
      <div className="leading-tight">
        <div className="text-3xl font-light tabular-nums">{data.temp}°</div>
        <div className="text-sm font-light tracking-wide text-white/60">
          {label}
          {data.name ? ` · ${data.name}` : ''}
        </div>
      </div>
    </div>
  );
}
