import React, { useState } from "react";
import Link from "next/link";
import { loginUser } from "../../../api/apiLoginRegister";
import TextField from "./TextField";
import PasswordField from "./PasswordField";
import SubmitButton from "./SubmitButton";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [IDTaiKhoan, setIDTaiKhoan] = useState("");
  const [MatKhau, setMatKhau] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(IDTaiKhoan, MatKhau);
      console.log("Login successful:", data);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      onLoginSuccess(data.user);
      onClose();
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose} title="Close">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div className="modal-header">
          <div className="modal-icon-wrapper">
            👋
          </div>
          <h2 className="modal-title">Welcome Back</h2>
          <p className="modal-subtitle">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <TextField
            label="Username"
            placeholder="Enter your username"
            value={IDTaiKhoan}
            onChange={(e) => setIDTaiKhoan(e.target.value)}
          />

          <PasswordField
            label="Password"
            placeholder="Enter your password"
            value={MatKhau}
            onChange={(e) => setMatKhau(e.target.value)}
          />

          {error && (
            <div className="form-error-alert">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <div style={{ marginTop: "1.5rem" }}>
            <SubmitButton
              loading={loading}
              text="Sign in"
              loadingText="Signing in..."
            />
          </div>
        </form>

        <p className="modal-footer">
          Don’t have an account?{" "}
          <Link href="/register" className="link-highlight">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;