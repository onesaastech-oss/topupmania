// Simple theme utility using localStorage and prefers-color-scheme

const THEME_KEY = "theme"; // 'light' | 'dark'

// Event listener system for theme changes
const themeChangeListeners = new Set();

export function getTheme() {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;

  // Default to light theme instead of following system preference
  return "light";
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function setTheme(theme) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  // Notify all listeners of theme change
  themeChangeListeners.forEach(callback => callback(theme));
}

export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

export function subscribeToThemeChanges(callback) {
  if (typeof window === "undefined") return () => {};
  
  // Add to theme change listeners
  themeChangeListeners.add(callback);
  
  // Also listen to system theme changes
  let systemThemeUnsubscribe = () => {};
  if (window.matchMedia) {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      // Only notify if no theme is stored (following system theme)
      const stored = window.localStorage.getItem(THEME_KEY);
      if (!stored) {
        // Always return light theme as default, not system preference
        callback("light");
      }
    };
    try {
      mql.addEventListener("change", handler);
      systemThemeUnsubscribe = () => {
        try {
          mql.removeEventListener("change", handler);
        } catch {
          mql.removeListener(handler);
        }
      };
    } catch {
      // Safari
      mql.addListener(handler);
      systemThemeUnsubscribe = () => mql.removeListener(handler);
    }
  }
  
  return () => {
    themeChangeListeners.delete(callback);
    systemThemeUnsubscribe();
  };
}

// For backward compatibility
export const subscribeToSystemThemeChanges = subscribeToThemeChanges;


