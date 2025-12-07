"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTestByID } from "../../../api/apiTest";
import { createSubmission, submitSubmission, getSubmissionByID } from "../../../api/apiSubmission";
import TestQuestionItem from "@/app/components/TestScreen/TestQuestionItem";
import { URLServer } from "@/api/apiConfig";

export default function TestDetailPage() {
  const { IDDeThi } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [test, setTest] = useState<any>(null);
  const [IDBaiThi, setIDBaiThi] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [ThoiGianBatDau, setThoiGianBatDau] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<any>(null);
  const isSubmittedRef = useRef(false);
  const initializingRef = useRef<string | null>(null);

  useEffect(() => {
    if (initializingRef.current === IDDeThi) return;
    initializingRef.current = IDDeThi as string;
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("You need to log in first!");
      router.push("/");
      return;
    }
    const userObj = JSON.parse(userData);
    setUser(userObj);

    const restoreOrStart = async () => {
      const saved = localStorage.getItem(`currentSubmission_${userObj.IDTaiKhoan}_${IDDeThi}`);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.IDDeThi === IDDeThi && data.user.IDTaiKhoan === userObj.IDTaiKhoan) {
          setUser(data.user);
          setAnswers(data.answers || {});
          setIDBaiThi(data.IDBaiThi);
          const { test } = await getTestByID(data.IDDeThi);
          setTest(test);
          const { submission } = await getSubmissionByID(data.IDBaiThi);
          setThoiGianBatDau(new Date(submission.ThoiGianBatDau).getTime());
          setLoading(false);
          return;
        }
      }

      try {
        const { test } = await getTestByID(IDDeThi as string);
        setTest(test);
        const submissionData = await createSubmission(IDDeThi, userObj);
        setIDBaiThi(submissionData.IDBaiThi);
        setThoiGianBatDau(new Date(submissionData.ThoiGianBatDau).getTime());
        localStorage.setItem(
          `currentSubmission_${userObj.IDTaiKhoan}_${IDDeThi}`,
          JSON.stringify({
            IDBaiThi: submissionData.IDBaiThi,
            IDDeThi,
            user: userObj,
            answers: {},
          })
        );
      } catch (error: any) {
        console.error("❌ Lỗi khi tạo bài thi:", error);
        setError(error.response.data.error);
      } finally {
        setLoading(false);
      }
    };
    
    if (IDDeThi) {
      restoreOrStart();
    }

  }, [IDDeThi, router]);

  useEffect(() => {
    if (!test) return;
    const allAnswers: { [key: string]: string } = {};
    if (test.Part1?.length > 0) {
      test.Part1.forEach((q: any) => { allAnswers[q.IDCauHoi] = answers[q.IDCauHoi] || ""; });
    }
    if (test.Part2?.length > 0) {
      test.Part2.forEach((p: any) => {
        p.CauHoi?.forEach((q: any) => { allAnswers[q.IDCauHoi] = answers[q.IDCauHoi] || ""; });
      });
    }
    setAnswers(allAnswers);
  }, [test]);

  useEffect(() => {
    if (!ThoiGianBatDau || !test) return;
    const timer = setInterval(() => {
      const now = Date.now();
      const duration = test.ThoiGianLam * 1000;
      const remaining = Math.max(0, Math.floor((ThoiGianBatDau + duration - now) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        autoSubmit();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [ThoiGianBatDau, test]);

  const handleAnswerChange = (IDCauHoi: string, IDDapAn: string) => {
    setAnswers((prev) => {
      const updated = { ...prev, [IDCauHoi]: IDDapAn };
      const current = JSON.parse(localStorage.getItem(`currentSubmission_${user.IDTaiKhoan}_${IDDeThi}`) || "{}");
      localStorage.setItem(
        `currentSubmission_${user.IDTaiKhoan}_${IDDeThi}`,
        JSON.stringify({ ...current, answers: updated })
      );
      return updated;
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSubmittedRef.current) {
        e.preventDefault(); 
        e.returnValue = ""; 
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const autoSubmit = async () => {
    setLoadingButton(true);
    try {
      if (!IDBaiThi) return alert("Submission not found!");
      isSubmittedRef.current = true;
      const submit = await submitSubmission(IDBaiThi, answers);
      localStorage.removeItem(`currentSubmission_${user.IDTaiKhoan}_${IDDeThi}`);
      alert(submit.message);
      router.push(`/my-submissions/${IDBaiThi}`);
    } catch (error: any) {
      isSubmittedRef.current = false;
      console.error(error);
      setLoadingButton(false);
      alert(error.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleSubmit = async () => {
    setLoadingButton(true);
    try {
      if (!IDBaiThi) return alert("Submission not found!");
      
      const allQuestions: string[] = [];
      if (test.Part1?.length > 0) for (const q of test.Part1) allQuestions.push(q.IDCauHoi);
      if (test.Part2?.length > 0)
        for (const p of test.Part2)
          if (p.CauHoi?.length > 0)
            for (const q of p.CauHoi) allQuestions.push(q.IDCauHoi);

      const unanswered = allQuestions.filter((id) => !answers[id]);
      if (unanswered.length > 0) {
        const confirmSubmit = confirm(`Bạn còn ${unanswered.length} câu chưa làm. Chắc chắn nộp?`);
        if (!confirmSubmit) {
            setLoadingButton(false);
            return;
        }
      }

      const submit = await submitSubmission(IDBaiThi, answers);
      localStorage.removeItem(`currentSubmission_${user.IDTaiKhoan}_${IDDeThi}`);
      isSubmittedRef.current = true;
      alert(submit.message);
      router.push(`/my-submissions/${IDBaiThi}`);
    } catch (error: any) {
      isSubmittedRef.current = false;
      console.error(error);
      setLoadingButton(false);
      alert(error.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  if (loading) return <p className="test-page-message animate-pulse-text">Loading test data...</p>;
  if (error) return <p className="test-page-message error">{error}</p>;

  let questionIndex = 1;

  return (
    <div className="test-detail-container">
      
      <div className="test-detail-header">
        <h1 className="test-detail-title">{test.TenDeThi}</h1>
        <div className="test-timer-badge">
          <span>⏱️</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <section className="test-section blue">
        <h2 className="test-section-title blue">PART 1</h2>
        
        {test.Part1?.map((q: any) => (
          <TestQuestionItem
            key={q.IDCauHoi}
            q={q}
            answers={answers}
            handleAnswerChange={handleAnswerChange}
            IDBaiThi={IDBaiThi}
            questionIndex={questionIndex++}
            color="blue"
          />
        ))}
        
        {test.Part1?.length === 0 && (
          <p className="empty-text">Không có câu hỏi nào trong phần này.</p>
        )}
      </section>

      <section className="test-section green">
        <h2 className="test-section-title green">PART 2</h2>
        
        {test.Part2?.map((p: any) => (
          <div key={p.IDDoanVan} className="passage-card">
            
            {p.NoiDung && <div className="passage-content">{p.NoiDung}</div>}
            
            {p.Audio && (
              <audio 
                controls 
                src={`${URLServer}${p.Audio}`} 
                className="question-audio-player mb-4">
                  Audio is not supported
              </audio>
            )}
            
            {p.EncodeAnh && (
              <img
                src={`${URLServer}/images${p.EncodeAnh}`}
                alt="Passage Illustration"
                className="passage-image"
              />
            )}

            <div className="mt-6">
                {p.CauHoi?.map((q: any) => (
                <TestQuestionItem
                    key={q.IDCauHoi}
                    q={q}
                    answers={answers}
                    handleAnswerChange={handleAnswerChange}
                    IDBaiThi={IDBaiThi}
                    questionIndex={questionIndex++}
                    color="green"
                />
                ))}
            </div>
          </div>
        ))}
        
        {test.Part2?.length === 0 && (
          <p className="empty-text">Không có câu hỏi nào trong phần này.</p>
        )}
      </section>

      <div className="submit-area">
        <button
          onClick={handleSubmit}
          disabled={loadingButton}
          className="btn-submit-exam"
        >
          {loadingButton ? "Submitting..." : "Submit Exam"}
        </button>
      </div>
    </div>
  );
}