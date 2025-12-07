"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Clock, Calendar, Timer } from "lucide-react";
import { getSubmissionByID } from "@/api/apiSubmission";
import { URLServer } from "@/api/apiConfig";
import SubQuestionItem from "@/app/components/SubScreen/SubQuestionItem";

export default function SubmissionDetailPage() {
  const router = useRouter();
  const { IDBaiThi } = useParams();
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const submissionData = await getSubmissionByID(IDBaiThi as string);
        setSubmission(submissionData.submission);
      } catch (error: any) {
        console.error(error);
        setError(error.response?.data?.error || "Không thể tải chi tiết bài thi.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [IDBaiThi]);

  if (loading) return <p className="submission-status-msg animate-pulse-text">Loading submission...</p>;
  if (error) return <p className="submission-status-msg error">{error}</p>;

  const calcDuration = (start?: string, end?: string) => {
    if (!start || !end) return "Chưa nộp";
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diff = Math.max(0, endTime - startTime);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes} phút ${seconds} giây`;
  };

  const diem = submission.TongDiem;
  const getScoreCardClass = () => {
    if (diem === null) return "none";
    if (diem >= 160) return "high";
    if (diem >= 100) return "medium";
    return "low";
  };

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "READING": return "type-reading";
      case "LISTENING": return "type-listening";
      case "WRITING": return "type-writing";
      case "SPEAKING": return "type-speaking";
      default: return "type-hybrid";
    }
  };

  let questionIndex = 1;

  return (
    <div className="submission-detail-container">
      
      <button onClick={() => router.push("/my-submissions")} className="btn-back">
        <ArrowLeft size={20} />
        Quay lại danh sách
      </button>

      <h1 className="submission-page-title">
        Submission Details #{IDBaiThi?.slice(0, 8)}...
      </h1>

      <div className={`submission-score-card ${getScoreCardClass()}`}>
        <div className="submission-score-header">
          <h2 className="font-bold text-xl text-gray-700">Kết quả chung</h2>
          <span className={`submission-type-badge ${getBadgeClass(submission.LoaiDeThi)}`}>
            {submission.LoaiDeThi}
          </span>
        </div>

        <div className="submission-info-grid">
          <div className="submission-info-item">
            <Trophy size={24} className="text-yellow-500" />
            <span className="submission-info-label">Điểm:</span>
            <span className={`submission-info-value score-text ${getScoreCardClass()}`}>
              {diem ?? "Chưa có"}
            </span>
          </div>

          <div className="submission-info-item">
            <Timer size={24} className="text-purple-500" />
            <span className="submission-info-label">Thời gian làm bài:</span>
            <span className="submission-info-value">
              {calcDuration(submission.ThoiGianBatDau, submission.ThoiGianKetThuc)}
            </span>
          </div>

          <div className="submission-info-item">
            <Calendar size={24} className="text-blue-500" />
            <span className="submission-info-label">Bắt đầu:</span>
            <span className="submission-info-value">
              {new Date(submission.ThoiGianBatDau).toLocaleString("vi-VN")}
            </span>
          </div>

          <div className="submission-info-item">
            <Clock size={24} className="text-green-500" />
            <span className="submission-info-label">Kết thúc:</span>
            <span className="submission-info-value">
              {submission.ThoiGianKetThuc
                ? new Date(submission.ThoiGianKetThuc).toLocaleString("vi-VN")
                : "Chưa nộp"}
            </span>
          </div>
        </div>
      </div>

      <section className="test-section blue">
        <h2 className="test-section-title blue">PART 1</h2>
        
        {submission.Part1.length === 0 ? (
          <p className="empty-text">Không có câu hỏi nào trong phần này.</p>
        ) : (
          <div className="space-y-6">
            {submission.Part1.map((q: any) => (
              <SubQuestionItem key={q.IDCauHoi} q={q} index={questionIndex++} />
            ))}
          </div>
        )}
      </section>

      <section className="test-section green mt-8">
        <h2 className="test-section-title green">PART 2</h2>
        
        {submission.Part2.length === 0 ? (
          <p className="empty-text">Không có câu hỏi nào trong phần này.</p>
        ) : (
          <div className="space-y-8">
            {submission.Part2.map((dv: any) => (
              <div key={dv.IDDoanVan} className="passage-card">
                
                {dv.NoiDung && <div className="passage-content">{dv.NoiDung}</div>}
                
                {dv.Audio && (
                  <audio 
                    controls 
                    src={`${URLServer}${dv.Audio}`} 
                    className="question-audio-player mb-4">
                      Trình duyệt không hỗ trợ audio
                  </audio>
                )}
                
                {dv.EncodeAnh && (
                  <img
                    src={`${URLServer}/images${dv.EncodeAnh}`}
                    alt="Đoạn văn minh họa"
                    className="passage-image"
                  />
                )}

                <div className="space-y-5 mt-6">
                  {dv.CauHoi.map((q: any) => (
                    <SubQuestionItem key={q.IDCauHoi} q={q} index={questionIndex++} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}