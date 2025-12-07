"use client";
import React, { useState, useEffect } from "react";
import { updateUserProfile } from "../../../api/apiLoginRegister";
import TextField from "../LoginRegisterProfile/TextField";
import PasswordField from "../LoginRegisterProfile/PasswordField";
import SubmitButton from "../LoginRegisterProfile/SubmitButton";
import { UserCog } from "lucide-react";

interface AccountUserProfileProps {
  initialUser: any;
  onUserUpdated: (updatedUser: any) => void;
}

export default function AccountUserProfile({ initialUser, onUserUpdated }: AccountUserProfileProps) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialUser) setUser(initialUser);
  }, [initialUser]);

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const { MatKhau, Email } = user;

    if (!Email?.trim()) return setError("Email cannot be empty");
    if (!isValidEmail(Email)) return setError("Invalid email format");
    
    if (MatKhau && MatKhau.length < 6) {
      return setError("Password needs at least 6 characters");
    }

    setLoading(true);
    try {
      const data = await updateUserProfile(user); 
      
      setSuccessMsg("User info updated successfully!");
      onUserUpdated(user); 
      
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error("Update error:", err);
      setError(err.response?.data?.error || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
        <div className="bg-blue-50 p-2 rounded-full text-blue-600">
          <UserCog size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Account Details</h2>
          <p className="text-sm text-gray-500">Edit information for user <span className="font-semibold text-gray-700">{user.IDTaiKhoan}</span></p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <TextField
            label="Username"
            value={user.IDTaiKhoan}
            disabled={true} 
          />

          <TextField
            label="Member Since"
            value={new Date(user.NgayTao).toLocaleDateString("vi-VN")}
            disabled={true}
          />

          <TextField
            label="Email Address"
            placeholder="Update email"
            value={user.Email}
            onChange={(e) => setUser({ ...user, Email: e.target.value })}
          />

          <PasswordField
            label="Set New Password"
            placeholder="Leave empty to keep current"
            value={user.MatKhau || ""}
            onChange={(e) => setUser({ ...user, MatKhau: e.target.value })}
          />
        </div>

        <div className="mt-4">
            {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-200 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
            )}

            {successMsg && (
                <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm font-medium border border-green-200 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    {successMsg}
                </div>
            )}
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-full md:w-auto md:min-w-[200px]">
            <SubmitButton
                loading={loading}
                text="Save Changes"
                loadingText="Saving..."
            />
          </div>
        </div>
      </form>
    </div>
  );
}