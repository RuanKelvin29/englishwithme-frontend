"use client";
import { useState } from "react";
import { registerUser } from "../../../api/apiLoginRegister";
import TextField from "../LoginRegisterProfile/TextField";
import PasswordField from "../LoginRegisterProfile/PasswordField";
import SubmitButton from "../LoginRegisterProfile/SubmitButton";
import { X } from "lucide-react";

interface RegisterModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterModal({ onClose, onSuccess }: RegisterModalProps) {
  const [IDTaiKhoan, setIDTaiKhoan] = useState("");
  const [MatKhau, setMatKhau] = useState("");
  const [Email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUsername = (username: string) => /^[a-zA-Z0-9_]+$/.test(username);
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
      alert(data.message || "Account created successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.error || "Register failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container max-w-md" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Create New Account</h2>
                <p className="text-sm text-gray-500">Add a new user to the system</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100">
                <X size={24} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Username"
            placeholder="Enter username"
            value={IDTaiKhoan}
            onChange={(e) => setIDTaiKhoan(e.target.value)}
          />

          <TextField
            label="Email Address"
            placeholder="Enter email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordField
            label="Password"
            placeholder="Enter password"
            value={MatKhau}
            onChange={(e) => setMatKhau(e.target.value)}
          />

          {error && (
            <div className="form-alert error text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6">
            <SubmitButton
              loading={loading}
              text="Create Account"
              loadingText="Creating..."
            />
          </div>
        </form>
      </div>
    </div>
  );
}