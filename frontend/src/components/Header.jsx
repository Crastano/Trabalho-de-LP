"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    if (typeof logout === 'function') {
      await logout();
    }
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <style>{`
                .header {
                    background: white;
                    border-bottom: 1px solid #e5e7eb;
                    padding: 16px 60px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }

                .header-logo {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1e3a8a;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .header-nav {
                    display: flex;
                    gap: 40px;
                    align-items: center;
                    flex: 1;
                    margin-left: 80px;
                }

                .header-nav a {
                    text-decoration: none;
                    color: #374151;
                    font-weight: 500;
                    font-size: 14px;
                    transition: color 0.3s;
                    cursor: pointer;
                }

                .header-nav a:hover {
                    color: #2563eb;
                }

                .header-actions {
                    display: flex;
                    gap: 16px;
                    align-items: center;
                }

                .header-profile {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .profile-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: #2563eb;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 16px;
                }

                .profile-menu {
                    position: relative;
                }

                .profile-dropdown {
                    position: absolute;
                    top: 44px;
                    right: 0;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    min-width: 180px;
                    z-index: 1000;
                    display: none;
                }

                .profile-dropdown.show {
                    display: block;
                }

                .profile-dropdown a,
                .profile-dropdown button {
                    display: block;
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 14px;
                    color: #374151;
                    text-decoration: none;
                    transition: background 0.2s;
                }

                .profile-dropdown a:hover,
                .profile-dropdown button:hover {
                    background: #f3f4f6;
                }

                .profile-dropdown .logout {
                    border-top: 1px solid #e5e7eb;
                    color: #dc2626;
                }

                .profile-dropdown .logout:hover {
                    background: #fee2e2;
                }

                .login-btn, .register-btn {
                    padding: 8px 16px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    border: none;
                    transition: all 0.3s;
                }

                .login-btn {
                    background: #2563eb;
                    color: white;
                }

                .login-btn:hover {
                    background: #1d4ed8;
                }

                .register-btn {
                    background: #f59e0b;
                    color: #111;
                }

                .register-btn:hover {
                    background: #d97706;
                }

                @media (max-width: 768px) {
                    .header {
                        padding: 12px 24px;
                    }

                    .header-nav {
                        display: none;
                    }

                    .header-logo {
                        font-size: 20px;
                    }
                }
            `}</style>

      <Link to="/" className="shrink-0">
        <img
          src="./src/assets/images/Logo.png"
          alt="Logo"
          className="w-10 h-10 rounded-full object-cover"
        />
      </Link>

      <nav className="header-nav">
        <Link to="/">HOME</Link>
        <Link to="/sobre">SOBRE</Link>
        <Link to="/rooms">ROOMS</Link>
        <Link to="/contact">CONTACT</Link>
      </nav>

      <div className="header-actions">
        {!user ? (
          <>
            <Link to="/login" className="login-btn">
              Iniciar Sessão
            </Link>
            <Link to="/registar" className="register-btn">
              Registar
            </Link>
          </>
        ) : (
          <div className="profile-menu">
            <div className="profile-icon" onClick={() => setShowDropdown(!showDropdown)}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className={`profile-dropdown ${showDropdown ? "show" : ""}`}>
              <div
                style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", fontSize: "13px", color: "#6b7280" }}
              >
                {user.name}
              </div>
              <Link to="/perfil" onClick={() => setShowDropdown(false)}>
                Ver Perfil
              </Link>
              {user.cargo === "administrador" ? (
                <Link to="/admin/dashboard" onClick={() => setShowDropdown(false)}>
                  Área Admin
                </Link>
              ) : (
                <Link to="/reservations" onClick={() => setShowDropdown(false)}>
                  Minhas Reservas
                </Link>
              )}
              <button onClick={handleLogout} className="logout">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
