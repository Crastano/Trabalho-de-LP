import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useAccessibility } from "../context/AccessibilityContext"

export default function AccessibilityWidget() {
  const { prefs, toggleHighContrast, toggleReduceMotion, toggleUnderlineLinks, increaseText, decreaseText, reset } =
    useAccessibility()

  const [open, setOpen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const panelId = useId()
  const btnRef = useRef(null)
  const closeRef = useRef(null)

  const textPercent = useMemo(() => `${Math.round((prefs.textScale ?? 1) * 100)}%`, [prefs.textScale])

  useEffect(() => {
    const onKeyDown = (e) => {
      // Ctrl+Alt+A abre/fecha
      if (e.ctrlKey && e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault()
        setOpen((v) => !v)
        return
      }

      if (e.key === "Escape") {
        setOpen(false)
        setShowHelp(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      // foco no fechar para facilitar teclado
      setTimeout(() => closeRef.current?.focus(), 0)
    } else {
      btnRef.current?.focus?.()
    }
  }, [open])

  return (
    <div className="a11y-widget" aria-label="Acessibilidade">
      <button
        ref={btnRef}
        type="button"
        className="a11y-fab"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
      >
        Acessibilidade
      </button>

      {open && (
        <div id={panelId} className="a11y-panel" role="dialog" aria-modal="false" aria-label="Opções de acessibilidade">
          <div className="a11y-panel-header">
            <div className="a11y-title">Opções</div>
            <button
              ref={closeRef}
              type="button"
              className="a11y-icon-btn"
              onClick={() => {
                setOpen(false)
                setShowHelp(false)
              }}
              aria-label="Fechar painel de acessibilidade"
            >
              ×
            </button>
          </div>

          <div className="a11y-section">
            <div className="a11y-row">
              <span>Tamanho do texto</span>
              <span className="a11y-muted">{textPercent}</span>
            </div>
            <div className="a11y-actions">
              <button type="button" className="a11y-btn" onClick={decreaseText} aria-label="Diminuir tamanho do texto">
                A-
              </button>
              <button type="button" className="a11y-btn" onClick={increaseText} aria-label="Aumentar tamanho do texto">
                A+
              </button>
              <button type="button" className="a11y-btn" onClick={reset} aria-label="Repor configurações de acessibilidade">
                Repor
              </button>
            </div>
          </div>

          <div className="a11y-section">
            <button type="button" className="a11y-toggle" onClick={toggleHighContrast} aria-pressed={prefs.highContrast}>
              <span>Alto contraste</span>
              <span className="a11y-pill">{prefs.highContrast ? "On" : "Off"}</span>
            </button>
            <button type="button" className="a11y-toggle" onClick={toggleUnderlineLinks} aria-pressed={prefs.underlineLinks}>
              <span>Sublinhar links</span>
              <span className="a11y-pill">{prefs.underlineLinks ? "On" : "Off"}</span>
            </button>
            <button type="button" className="a11y-toggle" onClick={toggleReduceMotion} aria-pressed={prefs.reduceMotion}>
              <span>Reduzir animações</span>
              <span className="a11y-pill">{prefs.reduceMotion ? "On" : "Off"}</span>
            </button>
          </div>

          <div className="a11y-section">
            <button
              type="button"
              className="a11y-help"
              onClick={() => setShowHelp((v) => !v)}
              aria-expanded={showHelp}
              aria-controls={`${panelId}-help`}
            >
              Ajuda
            </button>

            {showHelp && (
              <div id={`${panelId}-help`} className="a11y-help-box">
                <div className="a11y-help-title">Atalhos & navegação</div>
                <ul className="a11y-help-list">
                  <li>Teclado: use Tab para navegar e Enter para ativar.</li>
                  <li>Fechar: pressione Esc.</li>
                  <li>Acessibilidade: Ctrl+Alt+A abre/fecha este painel.</li>
                  <li>Use o link “Saltar para conteúdo” no topo da página.</li>
                </ul>
                <div className="a11y-help-actions">
                  <a className="a11y-link" href="mailto:maphotel@gmail.com?subject=Ajuda%20-%20Acessibilidade">
                    Contactar suporte
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
