// Thin bridge to the native Android wrapper. In an Android WebView, expose an
// object with `addJavascriptInterface(bridge, "Android")` implementing:
//   launchApp(pkg: String)       -> start the app's launch intent
//   openAction(action: String)   -> open a system screen ("settings", "wifi", ...)
//   getAppIcon(pkg: String)      -> base64 PNG of the installed app's own icon/banner ("" if none)
//   isBluetoothOn(): Boolean     -> optional
//   goBack()                     -> optional, called when BACK is pressed on home
// Outside the wrapper everything degrades gracefully for browser development.

const bridge = () => (typeof window !== 'undefined' ? window.Android : undefined);

export function launchApp(app) {
  const b = bridge();
  if (b?.launchApp && app.pkg) {
    b.launchApp(app.pkg);
    return { native: true };
  }
  if (app.url) window.open(app.url, '_blank', 'noopener,noreferrer');
  return { native: false };
}

export function openAction(item) {
  const b = bridge();
  if (b?.openAction) {
    b.openAction(item.action);
    return { native: true };
  }
  return { native: false };
}

// The installed app's real icon, straight from the device. Returns a data URI or ''.
export function getAppIcon(pkg) {
  const b = bridge();
  if (!b?.getAppIcon || !pkg) return '';
  try {
    const raw = b.getAppIcon(pkg);
    return raw ? `data:image/png;base64,${raw}` : '';
  } catch {
    return '';
  }
}

export function isBluetoothOn() {
  const b = bridge();
  return b?.isBluetoothOn ? !!b.isBluetoothOn() : true;
}

export function goBackNative() {
  const b = bridge();
  if (b?.goBack) b.goBack();
}
