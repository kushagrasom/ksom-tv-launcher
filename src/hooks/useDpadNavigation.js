import { useCallback, useEffect, useRef, useState } from 'react';

// Key codes cover desktop browsers plus common TV platforms:
//   Android TV: DPAD_CENTER = 23, BACK = 4
//   webOS BACK = 461, Tizen BACK = 10009
const KEYS = {
  left: ['ArrowLeft', 37, 21],
  right: ['ArrowRight', 39, 22],
  up: ['ArrowUp', 38, 19],
  down: ['ArrowDown', 40, 20],
  enter: ['Enter', ' ', 13, 23, 66],
  back: ['Escape', 'Backspace', 'BrowserBack', 27, 8, 4, 461, 10009],
};

const matches = (list, e) => list.includes(e.key) || list.includes(e.keyCode);

/**
 * Grid-style D-pad focus engine.
 *
 * @param {number[]} rows      Number of focusable items in each row.
 * @param {object}   options
 * @param {{row:number,col:number}} options.initial  Starting focus.
 * @param {(pos) => void} options.onActivate  ENTER / OK pressed.
 * @param {(pos) => void} options.onBack      BACK pressed.
 *
 * Moving UP/DOWN keeps your horizontal "column memory", so returning to a row
 * lands where you left it rather than snapping to the first item.
 */
export function useDpadNavigation(rows, { initial = { row: 0, col: 0 }, onActivate, onBack } = {}) {
  const [focus, setFocus] = useState(initial);

  const rowsRef = useRef(rows);
  const focusRef = useRef(focus);
  const memoryRef = useRef(initial.col);
  const handlers = useRef({ onActivate, onBack });

  rowsRef.current = rows;
  focusRef.current = focus;
  handlers.current = { onActivate, onBack };

  const move = useCallback((dir) => {
    const rws = rowsRef.current;
    const { row, col } = focusRef.current;
    let next = { row, col };

    if (dir === 'left' || dir === 'right') {
      const delta = dir === 'left' ? -1 : 1;
      const col2 = Math.max(0, Math.min(rws[row] - 1, col + delta));
      memoryRef.current = col2;
      next = { row, col: col2 };
    } else {
      const delta = dir === 'up' ? -1 : 1;
      let row2 = row + delta;
      while (row2 >= 0 && row2 < rws.length && rws[row2] === 0) row2 += delta;
      if (row2 < 0 || row2 >= rws.length) return;
      next = { row: row2, col: Math.min(memoryRef.current, rws[row2] - 1) };
    }

    if (next.row !== row || next.col !== col) setFocus(next);
  }, []);

  const focusTo = useCallback((pos) => {
    memoryRef.current = pos.col;
    setFocus(pos);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      for (const dir of ['left', 'right', 'up', 'down']) {
        if (matches(KEYS[dir], e)) {
          e.preventDefault();
          move(dir);
          return;
        }
      }
      if (matches(KEYS.enter, e)) {
        e.preventDefault();
        if (!e.repeat) handlers.current.onActivate?.(focusRef.current);
        return;
      }
      if (matches(KEYS.back, e)) {
        e.preventDefault();
        if (!e.repeat) handlers.current.onBack?.(focusRef.current);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move]);

  return { focus, focusTo };
}
