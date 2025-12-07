"use client";

import Link from "next/link";
import { Clock, FileText, Award, Trash2 } from "lucide-react";

interface SubItemProps {
  submission: any;
  handleDelete: (IDBaiThi: string) => void;
  loadingDelete: boolean;
  source: string;
}

export default function SubItem({
  submission,
  handleDelete,
  loadingDelete,
  source,
}: SubItemProps) {
  const diem = submission.TongDiem ?? null;
  const tongDiem = submission.LoaiDeThi == "HYBRID" ? 400 : 200;

  const getScoreClass = () => {
    if (diem === null) return "none";
    if (diem >= 160) return "high";
    if (diem >= 100) return "medium";
    return "low";
  };

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "LISTENING": return "type-listening";
      case "WRITING": return "type-writing";
      case "READING": return "type-reading";
      case "SPEAKING": return "type-speaking";
      default: return "type-hybrid";
    }
  };

  return (
    <div className={`sub-item-card ${loadingDelete ? "is-loading" : ""}`}>
      <div className="sub-item-overlay"></div>

      <button
        onClick={() => handleDelete(submission.IDBaiThi)}
        disabled={loadingDelete}
        className="sub-item-delete-btn"
        title="Delete submission"
      >
        {loadingDelete ? (
          <div className="delete-spinner"></div>
        ) : (
          <Trash2 size={18} />
        )}
      </button>

      <div className="sub-item-content">
        <div className="sub-item-header">
          <h2 className="sub-item-title" title={submission.TenDeThi}>
            {submission.TenDeThi}
          </h2>
          <span className={`sub-item-badge ${getBadgeClass(submission.LoaiDeThi)}`}>
            {submission.LoaiDeThi}
          </span>
        </div>

        <div className="sub-item-info">
          <p className="sub-item-row">
            <FileText size={16} className="sub-item-icon" />
            <span>
              Số câu hỏi: <span className="font-medium">{submission.SoCauHoi}</span>
            </span>
          </p>
          <p className="sub-item-row">
            <Clock size={16} className="sub-item-icon" />
            <span>Bắt đầu: {new Date(submission.ThoiGianBatDau).toLocaleString("vi-VN")}</span>
          </p>
          <p className="sub-item-row">
            <Clock size={16} className="sub-item-icon" />
            <span>
              Kết thúc:{" "}
              {submission.ThoiGianKetThuc
                ? new Date(submission.ThoiGianKetThuc).toLocaleString("vi-VN")
                : "-"}
            </span>
          </p>
          <p className={`sub-item-row score-text ${getScoreClass()}`}>
            <Award size={16} className="sub-item-icon" />
            <span>
              Điểm: {diem ?? "Chưa có"}/{tongDiem}
            </span>
          </p>
        </div>

        <Link href={source} style={{ marginTop: "auto" }}>
          <button className="sub-item-action-btn">
            Xem chi tiết
          </button>
        </Link>
      </div>
    </div>
  );
}