import Link from "next/link";
import { URLServer } from "@/api/apiConfig";

export interface Test {
  IDDeThi: string;
  TenDeThi: string;
  LoaiDeThi: "READING" | "LISTENING" | "WRITING" | "SPEAKING" | "HYBRID";
  EncodeAnh: string;
  MieuTa: string;
  SoCauHoi: number;
  NgayTao: string;
  customHref?: string;
  IsHidden?: boolean;
}

export default function TestItem({
  IDDeThi,
  TenDeThi,
  LoaiDeThi,
  EncodeAnh,
  MieuTa,
  SoCauHoi,
  NgayTao,
  customHref,
  IsHidden,
}: Test) {

  const hrefLink = customHref || `/test/${IDDeThi}`;
  
  const getBadgeClass = (type: string) => {
    switch (type) {
      case "READING": return "type-reading";
      case "LISTENING": return "type-listening";
      case "WRITING": return "type-writing";
      case "SPEAKING": return "type-speaking";
      default: return "type-hybrid";
    }
  };

  return (
    <Link href={hrefLink} className="test-item-link">
      <div className="test-item-card">
        
        <div className="test-item-image-wrapper">
          <img
            src={`${URLServer}/images${EncodeAnh}`}
            alt={TenDeThi}
            className="test-item-image"
            onError={(e) => {
                e.currentTarget.src = `${URLServer}/images/tests/default.png`; 
            }}
          />
          <span className={`test-item-badge ${getBadgeClass(LoaiDeThi)}`}>
            {LoaiDeThi}
          </span>
        </div>

        <div className="test-item-content">
          <h3 className="test-item-title" title={TenDeThi}>{TenDeThi}</h3>
          
          <p className="test-item-desc">{MieuTa || "No description available."}</p>
          
          <div className="test-item-footer">
            <div className="meta-info">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>{SoCauHoi} Questions</span>
            </div>
            <div className="meta-info">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span>{new Date(NgayTao).toLocaleDateString("vi-VN")}</span>
            </div>
          </div>
        </div>
        
      </div>
    </Link>
  );
}