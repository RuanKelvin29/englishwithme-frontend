"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTokenRole } from "@/api/getTokenRole";

interface UserAvatarProps {
  username?: string;
  onLogout: () => void;
  size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  username = "user",
  onLogout,
  size = 40,
}) => {
  const [role, setRole] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const r = getTokenRole();
    setRole(r);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (url: string) => {
    router.push(url);
    setOpen(false);
  };

  return (
    <div ref={ref} className="avatar-wrapper">
      <div
        className={`avatar-img ${open ? "active" : ""}`}
        style={{ width: size, height: size }}
        onClick={() => setOpen(!open)}
      >
        {username.charAt(0).toUpperCase()}
      </div>

      {open && (
        <div className="dropdown-menu">
          <div className="dropdown-arrow"></div>
          <div className="menu-list">

            <button onClick={() => handleNavigation("/my-profile")} className="menu-item">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>My Profile</span>
            </button>

            <button onClick={() => handleNavigation("/my-submissions")} className="menu-item">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span>My Submissions</span>
            </button>

            {role === "admin" && (
              <>
                <button onClick={() => handleNavigation("/accounts")} className="menu-item">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  <span>All Accounts</span>
                </button>

                <button onClick={() => handleNavigation("/manage-tests")} className="menu-item">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Manage Tests</span>
                </button>

                <button onClick={() => handleNavigation("/add-test")} className="menu-item highlight">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span>Add New Test</span>
                </button>
              </>
            )}

            <div className="menu-divider"></div>

            <button onClick={onLogout} className="menu-item logout">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;