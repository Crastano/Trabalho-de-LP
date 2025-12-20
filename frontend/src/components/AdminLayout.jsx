import { Link, useLocation } from "react-router"

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

  return (
    <div className="admin-shell">
      <style>{`
        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: #e9edf9;
          color: #0f172a;
          font-family: 'Segoe UI', 'Inter', system-ui, sans-serif;
        }

        .admin-sidebar {
          width: 230px;
          background: #ffffff;
          border-right: 1px solid #d9dde8;
          padding: 18px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-logo {
          font-weight: 800;
          font-size: 18px;
          letter-spacing: -0.2px;
          color: #111827;
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
          color: #4b5563;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid transparent;
          transition: all 0.12s ease;
        }

        .admin-nav a:hover {
          background: #f1f5f9;
          color: #111827;
        }

        .admin-nav a.active {
          background: #e9eefc;
          border-color: #d9e2ff;
          color: #1d4ed8;
          font-weight: 700;
        }

        .nav-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: #111827;
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
          color: #0f172a;
          letter-spacing: -0.4px;
        }

        .admin-top .subtitle {
          margin: 0;
          font-size: 14px;
          color: #1f2937;
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
          background: #ffffff;
          border: 2px solid #f4d77f;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
        }

        .admin-card h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          color: #111827;
        }

        .admin-card p {
          margin: 0;
          color: #4b5563;
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
          color: #111827;
        }

        .admin-kpi .label {
          font-size: 13px;
          color: #6b7280;
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
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
          text-align: left;
          color: #0f172a;
        }

        .admin-table th {
          color: #6b7280;
          font-weight: 600;
          background: #f9fafb;
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

        .admin-btn.secondary {
          background: #e5e7eb;
          color: #111827;
        }

        .admin-btn:hover { transform: translateY(-1px); }

        .admin-filters {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .admin-input, .admin-select {
          border: 1px solid #d1d5db;
          background: #ffffff;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 13px;
          color: #111827;
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
          color: #6b7280;
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

        .admin-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .admin-section-header h3 { margin: 0; font-size: 16px; color: #111827; }
        .admin-section-header p { margin: 0; font-size: 13px; color: #6b7280; }
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
