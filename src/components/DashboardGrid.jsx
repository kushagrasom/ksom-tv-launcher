import FocusCard from './FocusCard.jsx';
import AppTile from './AppTile.jsx';
import { APPS, UTILITIES } from '../config/apps.js';

function SectionLabel({ children }) {
  return (
    <h2 className="mb-6 flex items-center gap-4 pl-1 text-sm font-medium uppercase tracking-[0.35em] text-white/55">
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: 'rgb(var(--accent-rgb))', boxShadow: '0 0 14px 2px rgb(var(--accent-rgb) / 0.8)' }}
      />
      {children}
      <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
    </h2>
  );
}

/**
 * Rows 1 and 2 of the focus grid: streaming apps, then system shortcuts.
 * (Row 0 is the status bar, owned by StatusBar.)
 */
export default function DashboardGrid({ appsRow, utilsRow, focus, activation, onHover }) {
  return (
    <div className="space-y-10">
      <section>
        <SectionLabel>Apps</SectionLabel>
        <div className="grid grid-cols-6 gap-6">
          {APPS.map((app, col) => (
            <AppTile
              key={app.id}
              app={app}
              focused={focus.row === appsRow && focus.col === col}
              activation={activation}
              onHover={() => onHover({ row: appsRow, col })}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>System</SectionLabel>
        <div className="grid grid-cols-6 gap-6">
          {UTILITIES.map((item, col) => {
            const focused = focus.row === utilsRow && focus.col === col;
            const { Icon } = item;
            return (
              <FocusCard
                key={item.id}
                id={item.id}
                label={item.name}
                focused={focused}
                activation={activation}
                onHover={() => onHover({ row: utilsRow, col })}
                className="flex items-center gap-5 rounded-full py-4 pl-4 pr-8"
              >
                <span
                  className="grid h-14 w-14 place-items-center rounded-full transition-colors duration-300"
                  style={{
                    background: focused ? 'rgb(var(--accent-rgb) / 0.35)' : 'rgb(255 255 255 / 0.08)',
                  }}
                >
                  <Icon className="h-7 w-7 text-white" strokeWidth={1.5} />
                </span>
                <span className="text-xl font-light tracking-wide text-white/90">{item.name}</span>
              </FocusCard>
            );
          })}
        </div>
      </section>
    </div>
  );
}
