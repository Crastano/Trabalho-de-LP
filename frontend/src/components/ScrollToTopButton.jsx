import { useEffect, useMemo, useState } from "react"
import { useAccessibility } from "../context/AccessibilityContext"

export default function ScrollToTopButton() {
  const { prefs } = useAccessibility()
  const [visible, setVisible] = useState(false)

  const prefersInstant = useMemo(() => !!prefs.reduceMotion, [prefs.reduceMotion])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0
      setVisible(y > 400)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      className="scroll-top-btn"
      onClick={() => {
        window.scrollTo({ top: 0, left: 0, behavior: prefersInstant ? "auto" : "smooth" })
      }}
      aria-label="Voltar ao topo da página"
    >
      Topo
    </button>
  )
}
