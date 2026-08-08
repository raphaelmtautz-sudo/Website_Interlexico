"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

export type ThemePref = "auto" | "dark" | "light" | "contrast";
type Resolved = "dark" | "light" | "contrast";

export const STORAGE_KEY = "il-theme";

/**
 * Löst die Nutzerpräferenz zu einem konkreten Theme auf.
 * "auto" folgt zunächst prefers-color-scheme, sonst der Tageszeit
 * (07–19 Uhr hell, sonst dunkel — passend zur premium-dunklen Marke).
 */
export function resolveTheme(pref: ThemePref): Resolved {
  if (pref !== "auto") return pref;
  if (typeof window !== "undefined" && window.matchMedia) {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  }
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? "light" : "dark";
}

function apply(pref: ThemePref) {
  const el = document.documentElement;
  el.setAttribute("data-theme", resolveTheme(pref));
  el.setAttribute("data-theme-pref", pref);
}

/* --- Externer Store (localStorage) via useSyncExternalStore ---
   Vermeidet setState-in-Effect und liefert saubere SSR-Hydration. */
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): ThemePref {
  return (localStorage.getItem(STORAGE_KEY) as ThemePref | null) ?? "light";
}

function getServerSnapshot(): ThemePref {
  return "light";
}

function setStoredPref(p: ThemePref) {
  localStorage.setItem(STORAGE_KEY, p);
  apply(p);
  listeners.forEach((l) => l());
}

interface ThemeContextValue {
  pref: ThemePref;
  resolved: Resolved;
  setPref: (p: ThemePref) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pref = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Bei "auto" auf Systemwechsel (hell/dunkel) reagieren — reiner DOM-Effekt.
  useEffect(() => {
    if (pref !== "auto" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("auto");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [pref]);

  const setPref = useCallback((p: ThemePref) => setStoredPref(p), []);
  const resolved = resolveTheme(pref);

  return (
    <ThemeContext.Provider value={{ pref, resolved, setPref }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme muss innerhalb von ThemeProvider genutzt werden");
  return ctx;
}
