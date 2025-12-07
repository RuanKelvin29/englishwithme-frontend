"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoginModal from "../LoginRegisterProfile/LoginModal";
import UserAvatar from "./UserAvatar";
import { URLServer } from "@/api/apiConfig";

const Header: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname(); 

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("You want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      for (let key in localStorage) {
        if (key.startsWith(`currentSubmission_${user.IDTaiKhoan}`)) {
          localStorage.removeItem(key);
        }
      }
      setUser(null);
      window.location.reload();
    }
  };

  if (!isClient) return null;

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link href="/" className="logo-link">
            <h1 className="brand-name">
              ENGLISH <span className="brand-accent">with Me</span>
            </h1>
          </Link>

          <nav className="nav-menu">
            <Link 
              href="/" 
              className={`nav-link ${pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>
            
            <Link 
              href="/test" 
              className={`nav-link ${pathname === "/test" ? "active" : ""}`}
            >
              Tests
            </Link>

            <div className="auth-action">
              {!user ? (
                <button
                  className="login-btn"
                  onClick={() => setShowLogin(true)}
                >
                  Log in
                </button>
              ) : (
                <UserAvatar
                  username={user.IDTaiKhoan}
                  onLogout={handleLogout}
                />
              )}
            </div>
          </nav>
        </div>
      </header>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
          }}
        />
      )}
    </>
  );
};

export default Header;