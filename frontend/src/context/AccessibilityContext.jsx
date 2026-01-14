import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "a11y_prefs_v1"

const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

const defaultPrefs = {
  highContrast: false,
  reduceMotion: false,
  underlineLinks: false,
  textScale: 1,
}

const AccessibilityContext = createContext(null)

const readPrefs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultPrefs
    const parsed = JSON.parse(raw)
    return {
      ...defaultPrefs,
      ...parsed,
      textScale: clamp(Number(parsed?.textScale ?? 1), 0.9, 1.5),
    }
  } catch {
    return defaultPrefs
  }
}

export function AccessibilityProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    if (typeof window === "undefined") return defaultPrefs
    return readPrefs()
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      // ignore storage errors
    }

    const root = document.documentElement

    root.classList.toggle("a11y-contrast", !!prefs.highContrast)
    root.classList.toggle("a11y-reduce-motion", !!prefs.reduceMotion)
    root.classList.toggle("a11y-underline-links", !!prefs.underlineLinks)

    root.style.setProperty("--a11y-text-scale", String(prefs.textScale ?? 1))
  }, [prefs])

  const api = useMemo(() => {
    const setTextScale = (next) => {
      setPrefs((prev) => ({ ...prev, textScale: clamp(Number(next), 0.9, 1.5) }))
    }

    return {
      prefs,
      setPrefs,
      toggleHighContrast: () => setPrefs((p) => ({ ...p, highContrast: !p.highContrast })),
      toggleReduceMotion: () => setPrefs((p) => ({ ...p, reduceMotion: !p.reduceMotion })),
      toggleUnderlineLinks: () => setPrefs((p) => ({ ...p, underlineLinks: !p.underlineLinks })),
      increaseText: () => setTextScale((prefs.textScale ?? 1) + 0.1),
      decreaseText: () => setTextScale((prefs.textScale ?? 1) - 0.1),
      reset: () => setPrefs(defaultPrefs),
    }
  }, [prefs])

  return <AccessibilityContext.Provider value={api}>{children}</AccessibilityContext.Provider>
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider")
  return ctx
}
