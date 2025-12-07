"use client";

import Link from "next/link";
import { Mail, Calendar, Clock, Trash2, Eye, Shield } from "lucide-react";

interface AccountItemProps {
  account: {
    IDTaiKhoan: string;
    Email: string;
    VaiTro: string;
    NgayTao: string;
    ThoiGianDangNhap?: string;
  };
  onDelete: (id: string) => void;
  loadingDelete: boolean;
}

export default function AccountItem({ account, onDelete, loadingDelete }: AccountItemProps) {
  
  const getRoleClass = (role: string) => {
    return role === "admin" ? "badge-admin" : "badge-student";
  };

  return (
    <div className={`account-card ${loadingDelete ? "is-loading" : ""}`}>
      <div className="account-overlay"></div>

      <button
        onClick={() => onDelete(account.IDTaiKhoan)}
        disabled={loadingDelete}
        className="account-delete-btn"
        title="Delete Account"
      >
        {loadingDelete ? <div className="spinner-small"></div> : <Trash2 size={18} />}
      </button>

      <div className="account-content">
        
        <div className="account-header">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
               <h3 className="account-username" title={account.IDTaiKhoan}>
                  {account.IDTaiKhoan}
               </h3>
               <span className={`account-role-badge ${getRoleClass(account.VaiTro)}`}>
                  {account.VaiTro === 'admin' && <Shield size={12} className="mr-1"/>}
                  {account.VaiTro.toUpperCase()}
               </span>
            </div>

            <div className="h-px w-full bg-gray-100 mt-1"></div>
          </div>
        </div>

        <div className="account-info-list">
          <div className="account-info-row">
            <Mail size={16} className="info-icon" />
            <span className="info-text truncate" title={account.Email}>
                {account.Email}
            </span>
          </div>
          <div className="account-info-row">
            <Calendar size={16} className="info-icon" />
            <span className="info-text">
              Joined: {new Date(account.NgayTao).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <div className="account-info-row">
            <Clock size={16} className="info-icon" />
            <span className="info-text">
              Last Login: {account.ThoiGianDangNhap 
                ? new Date(account.ThoiGianDangNhap).toLocaleString("vi-VN") 
                : "Never"}
            </span>
          </div>
        </div>

        <div className="account-footer">
          <Link href={`/accounts/${account.IDTaiKhoan}`} className="account-btn-detail">
            <Eye size={18} />
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}