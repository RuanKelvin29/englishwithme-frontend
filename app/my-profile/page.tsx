"use client";
import React, { useEffect, useState } from "react";
import { updateUserProfile } from "../../api/apiLoginRegister";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TextField from "../components/LoginRegisterProfile/TextField";
import PasswordField from "../components/LoginRegisterProfile/PasswordField";
import SubmitButton from "../components/LoginRegisterProfile/SubmitButton";

export default function MyProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        router.push("/");
      }
    };
    getUser();
  }, [router]);

  const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    
    const { MatKhau, Email } = user;

    if (!Email.trim()) return setError('Email cannot be empty');
    if (!isValidEmail(Email)) return setError("Invalid email format");
    if (!MatKhau.trim()) return setError('Password cannot be empty');
    if (MatKhau.length < 6) return setError("Password needs at least 6 characters");

    setLoading(true);
    try {
      const data = await updateUserProfile(user);
      setSuccessMsg("Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify(user));
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (error: any) {
      console.error("Lỗi cập nhật:", error);
      setError(error.response?.data?.error || "Saving failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="profile-page-wrapper">
      <div className="profile-card">     
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.IDTaiKhoan.charAt(0).toUpperCase()}
          </div>
          <h2 className="profile-title">{user.IDTaiKhoan}</h2>
          <p className="profile-subtitle">Manage your account settings</p>
        </div>

        <form onSubmit={handleSave} className="profile-form">
          <div className="grid gap-5">
            <TextField
              label="Username"
              placeholder="Enter your username"
              value={user.IDTaiKhoan}
              disabled={true}
            />

            <TextField
              label="Email Address"
              placeholder="Enter your new email"
              value={user.Email}
              onChange={(e) => setUser({ ...user, Email: e.target.value })}
            />

            <PasswordField
              label="New Password"
              placeholder="Enter new password"
              value={user.MatKhau}
              onChange={(e) => setUser({ ...user, MatKhau: e.target.value })}
            />

            <TextField
              label="Member Since"
              value={new Date(user.NgayTao).toLocaleDateString("vi-VN")}
              disabled={true}
            />
          </div>

          {error && (
            <div className="form-alert error">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="form-alert success">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          <div className="profile-actions">
            <SubmitButton
              loading={loading}
              text="Update profile"
              loadingText="Updating..."
            />
            <Link href="/" className="btn-cancel">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}