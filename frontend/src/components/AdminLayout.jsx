import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router"

const PREF_THEME_KEY = "pref_theme"
const THEME_EVENT = "pref-theme-changed"

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "D" },
  { label: "Gestão de Quartos", path: "/admin/quartos", icon: "Q" },
  { label: "Gestão de Reservas", path: "/admin/reservas", icon: "R" },
  { label: "Gestão de Clientes", path: "/admin/clientes", icon: "C" },
  { label: "Pagamentos", path: "/admin/pagamentos", icon: "P" },
  { label: "Relatórios", path: "/admin/relatorios", icon: "L" },
  { label: "Perfil/Configurações", path: "/admin/perfil", icon: "S" },
  { label: "Home", path: "/", icon: "H" },
]

export default function AdminLayout({ title, subtitle, actions, children }) {
  const location = useLocation()
  const [theme, setTheme] = useState("claro")

  useEffect(() => {
    const readTheme = () => {
      const t = localStorage.getItem(PREF_THEME_KEY)
      setTheme(t === "escuro" ? "escuro" : "claro")
    }

    readTheme()
    window.addEventListener("storage", readTheme)
    window.addEventListener(THEME_EVENT, readTheme)
    return () => {
      window.removeEventListener("storage", readTheme)
      window.removeEventListener(THEME_EVENT, readTheme)
    }
  }, [])

  return (
    <div className={`admin-shell ${theme === "escuro" ? "theme-dark" : "theme-light"}`}>
      <style>{`
        .admin-shell {
          --bg: #e9edf9;
          --surface: #ffffff;
          --border: #d9dde8;
          --text: #0f172a;
          --text-strong: #111827;
          --muted: #4b5563;
          --muted-2: #6b7280;
          --hover: #f1f5f9;
          --active-bg: #e9eefc;
          --active-border: #d9e2ff;
          --input-border: #d1d5db;
          --table-head: #f9fafb;
          --card-border: #f4d77f;
          --shadow: rgba(15, 23, 42, 0.08);

          display: flex;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: 'Segoe UI', 'Inter', system-ui, sans-serif;
        }

        .admin-shell.theme-dark {
          --bg: #0f172a;
          --surface: #111827;
          --border: #1f2937;
          --text: #f8fafc;
          --text-strong: #f9fafb;
          --muted: #e5e7eb;
          --muted-2: #d1d5db;
          --hover: #1f2937;
          --active-bg: #1f2937;
          --active-border: #d9ddeb;
          --input-border: #4b5563;
          --table-head: #0f172a;
          --shadow: rgba(0, 0, 0, 0.25);
        }

        .admin-sidebar {
          width: 230px;
          background: var(--surface);
          border-right: 1px solid var(--border);
          padding: 18px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-logo {
          font-weight: 800;
          font-size: 18px;
          letter-spacing: -0.2px;
          color: var(--text-strong);
          margin-bottom: 6px;
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .admin-nav a {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 12px;
          border-radius: 10px;
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid transparent;
          transition: all 0.12s ease;
        }

        .admin-nav a:hover {
          background: var(--hover);
          color: var(--text-strong);
        }

        .admin-nav a.active {
          background: var(--active-bg);
          border-color: var(--active-border);
          color: #1d4ed8;
          font-weight: 700;
        }

        .nav-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--hover);
          border: 1px solid var(--border);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: var(--text-strong);
        }

        .admin-main {
          flex: 1;
          padding: 24px 32px 32px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .admin-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-top h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.4px;
        }

        .admin-top .subtitle {
          margin: 0;
          font-size: 14px;
          color: var(--muted);
          font-weight: 700;
          letter-spacing: -0.1px;
        }

        .admin-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .admin-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .admin-grid {
          display: grid;
          gap: 14px;
        }

        .admin-grid.cols-4 { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
        .admin-grid.cols-3 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        .admin-grid.cols-2 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }

        .admin-card {
          background: var(--surface);
          border: 2px solid var(--card-border);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px var(--shadow);
        }

        .admin-card h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          color: var(--text-strong);
        }

        .admin-card p {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
        }

        .admin-kpi {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .admin-kpi .value {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-strong);
        }

        .admin-kpi .label {
          font-size: 13px;
          color: var(--muted-2);
        }

        .admin-kpi .trend {
          font-size: 12px;
          color: #16a34a;
          font-weight: 600;
        }

        .admin-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th,
        .admin-table td {
          padding: 10px 12px;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
          text-align: left;
          color: var(--text);
        }

        .admin-table th {
          color: var(--muted-2);
          font-weight: 600;
          background: var(--table-head);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge.success { color: #16a34a; background: #dcfce7; }
        .badge.warning { color: #d97706; background: #fef3c7; }
        .badge.danger { color: #dc2626; background: #fee2e2; }
        .badge.info { color: #2563eb; background: #dbeafe; }

        .admin-btn {
          border: none;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }

        .admin-btn.primary {
          background: #f2c94c;
          color: #1f2937;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }

        .admin-btn.danger {
          background: #ef4444;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }

        .admin-btn.secondary {
          background: #e5e7eb;
          color: #111827;
        }

        .admin-shell.theme-dark .admin-btn.secondary {
          background: #1f2937;
          color: #f9fafb;
        }

        .admin-btn:hover { transform: translateY(-1px); }

        .admin-map-card {
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 14px;
          background: linear-gradient(180deg, var(--surface) 0%, rgba(248, 250, 252, 0.75) 100%);
          box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08);
        }

        .admin-shell.theme-dark .admin-map-card {
          background: linear-gradient(180deg, var(--surface) 0%, rgba(2, 6, 23, 0.15) 100%);
        }

        .admin-map-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .admin-map-date-nav {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: rgba(248, 250, 252, 0.9);
        }

        .admin-shell.theme-dark .admin-map-date-nav {
          background: rgba(15, 23, 42, 0.55);
        }

        .admin-map-date-btn {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface);
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          color: #1d4ed8;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.12s ease, background 0.12s ease;
        }

        .admin-map-date-btn:hover {
          background: var(--hover);
          transform: translateY(-1px);
        }

        .admin-map-date-label {
          font-size: 13px;
          color: var(--text);
          font-weight: 800;
          min-width: 150px;
          text-align: center;
          text-transform: capitalize;
        }

        .admin-map-layout {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: 14px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .admin-map-layout { grid-template-columns: 1fr; }
        }

        .admin-map-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, var(--surface) 0%, rgba(241, 245, 249, 0.95) 100%);
        }

        .admin-shell.theme-dark .admin-map-grid {
          background: linear-gradient(180deg, var(--surface) 0%, rgba(2, 6, 23, 0.22) 100%);
        }

        .admin-map-row {
          display: grid;
          grid-template-columns: repeat(var(--cols), 1fr);
          gap: 8px;
        }

        .admin-map-cell {
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          font-weight: 900;
          box-shadow: 0 10px 18px rgba(2, 6, 23, 0.12);
          cursor: pointer;
          transition: transform 0.12s ease, filter 0.12s ease;
        }

        .admin-map-cell:hover { transform: translateY(-1px); filter: brightness(0.98); }
        .admin-map-cell:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .admin-map-cell.free { background: #22c55e; }
        .admin-map-cell.occupied { background: #f97316; }
        .admin-map-cell.reserved { background: #ef4444; }

        .admin-map-side {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-map-legend {
          padding: 12px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--surface);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .admin-map-legend .item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--muted);
          font-weight: 700;
        }

        .admin-map-legend .swatch {
          width: 18px;
          height: 18px;
          border-radius: 6px;
        }

        .admin-map-hint {
          padding: 12px;
          border-radius: 14px;
          border: 1px solid var(--active-border);
          background: var(--active-bg);
          color: var(--text);
          font-size: 13px;
          font-weight: 700;
          box-shadow: 0 10px 18px rgba(2, 6, 23, 0.06);
        }

        .admin-filters {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .admin-input, .admin-select {
          border: 1px solid var(--input-border);
          background: var(--surface);
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 13px;
          color: var(--text);
          min-width: 160px;
        }

        .admin-input:focus, .admin-select:focus {
          outline: none;
          border-color: #1d4ed8;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .admin-chart-bars {
          display: flex;
          gap: 6px;
          align-items: flex-end;
          height: 140px;
        }

        .admin-chart-bars .bar {
          flex: 1;
          background: #22c55e;
          border-radius: 6px 6px 2px 2px;
          min-width: 10px;
        }

        .admin-chart-bars .bar.danger { background: #ef4444; }
        .admin-chart-bars .bar.warning { background: #f59e0b; }
        .admin-chart-bars .bar.info { background: #3b82f6; }

        .admin-chart-legend {
          display: flex;
          gap: 12px;
          margin-top: 8px;
          font-size: 12px;
          color: var(--muted-2);
          flex-wrap: wrap;
        }

        .pill {
          padding: 4px 10px;
          border-radius: 999px;
          background: #e5e7eb;
          font-size: 12px;
          color: #374151;
          font-weight: 600;
        }

        .admin-shell.theme-dark .pill {
          background: #1f2937;
          color: #f9fafb;
        }

        .admin-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .admin-section-header h3 { margin: 0; font-size: 16px; color: #111827; }
        .admin-section-header p { margin: 0; font-size: 13px; color: #6b7280; }

        .admin-shell.theme-dark .admin-section-header h3 { color: var(--text-strong); }
        .admin-shell.theme-dark .admin-section-header p { color: var(--muted-2); }
      `}</style>

      <aside className="admin-sidebar">
        <div className="admin-logo"> MapHotel</div>
        <nav className="admin-nav">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path)
            return (
              <Link key={item.path} to={item.path} className={active ? "active" : ""}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-top">
          <div>
            {subtitle ? <p className="subtitle">{subtitle}</p> : null}
            <h1>{title}</h1>
          </div>
          {actions ? <div className="admin-actions">{actions}</div> : null}
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  )
}
