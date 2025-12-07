"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "../../api/apiLoginRegister";
import TextField from "../components/LoginRegisterProfile/TextField";
import PasswordField from "../components/LoginRegisterProfile/PasswordField";
import SubmitButton from "../components/LoginRegisterProfile/SubmitButton";

export default function RegisterPage() {
  const router = useRouter();

  const [IDTaiKhoan, setIDTaiKhoan] = useState("");
  const [MatKhau, setMatKhau] = useState("");
  const [Email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUsername = (username: string) => {
    const regex = /^[a-zA-Z0-9_]+$/; 
    return regex.test(username);
  };

  const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!IDTaiKhoan.trim()) return setError('Username cannot be empty');
    if (IDTaiKhoan.length < 5 || IDTaiKhoan.length > 20) return setError("Username must be 5-20 characters");
    if (!isValidUsername(IDTaiKhoan)) return setError("Username cannot have special characters");
    if (!Email.trim()) return setError('Email cannot be empty');
    if (!isValidEmail(Email)) return setError("Invalid email format");
    if (!MatKhau.trim()) return setError('Password cannot be empty');
    if (MatKhau.length < 6) return setError("Password needs at least 6 characters");

    setLoading(true);
    try {
      const data = await registerUser(IDTaiKhoan, MatKhau, Email);
      console.log("Register successful:", data);
      alert("Registration successful!"); 
      router.push("/"); 
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.error || "Register failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="bg-grid-pattern"></div>
      <div className="auth-card">  
        <Link href="/" className="auth-back-link">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Home Page
        </Link>

        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join us to improve your English skills today.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="grid gap-4">
            <TextField
              label="Username"
              placeholder="Enter your username"
              value={IDTaiKhoan}
              onChange={(e) => setIDTaiKhoan(e.target.value)}
            />

            <TextField
              label="Email Address"
              placeholder="Enter your email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordField
              label="Password"
              placeholder="Enter your password"
              value={MatKhau}
              onChange={(e) => setMatKhau(e.target.value)}
            />
          </div>

          {error && (
            <div className="form-alert error">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6">
            <SubmitButton
              loading={loading}
              text="Create Account"
              loadingText="Creating Account..."
            />
          </div>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <Link href="/" className="link-highlight">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}