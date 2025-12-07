"use client";
import { CheckCircle, XCircle } from "lucide-react";
import { URLServer } from "@/api/apiConfig";

const SubQuestionItem = ({ q, index }: any) => {
  const type = q.LoaiCauHoi;
  
  const chosenAnswer = q.DapAn.find((d: any) => d.IDDapAn == q.CauTraLoi.IDDapAn);
  const isCorrectChoice = chosenAnswer?.KetQua == 1;
  const hasChosen = !!chosenAnswer;

  const getContainerClass = () => {
    if (hasChosen && isCorrectChoice) return "correct"; 
    return "wrong";
  };

  return (
    <div className={`sub-question-item ${getContainerClass()}`}>
      <h2 className="question-text">
        Question {index}: {q.NoiDung}
      </h2>

      {q.Audio && (
        <audio
          controls
          src={`${URLServer}${q.Audio}`}
          className="question-audio-player"
        >
          Trình duyệt không hỗ trợ audio.
        </audio>
      )}

      {(type === "READING" || type === "LISTENING") && (
        <ul className="answers-list">
          {q.DapAn.map((d: any) => {
            const isCorrect = d.KetQua == 1;
            const isChosen = d.IDDapAn == q.CauTraLoi.IDDapAn;

            let itemClass = "default";
            if (isCorrect) itemClass = "correct";
            else if (isChosen && !isCorrect) itemClass = "wrong";

            return (
              <li key={d.IDDapAn} className={`sub-answer-item ${itemClass}`}>
                <span>{d.NoiDung}</span>
                {isCorrect ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : isChosen && !isCorrect ? (
                  <XCircle className="text-red-600" size={20} />
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {type === "WRITING" && (
        <div className="sub-feedback-section">
          <h3 className="sub-feedback-title">Your Answer:</h3>

          <div className="sub-user-answer-box">
            {q.CauTraLoi?.NoiDung || (
              <span className="sub-empty-text">No answer submitted.</span>
            )}
          </div>

          <div>
            <p className="sub-score-text">
              Score: <span className="sub-score-value">{q.CauTraLoi?.DiemAI}</span>
            </p>

            <p className="sub-feedback-title mt-2">Feedback:</p>
            <div className="sub-ai-feedback-box">
              {q.CauTraLoi?.NhanXetAI || (
                <span className="sub-empty-text">No feedback available.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {type === "SPEAKING" && (
        <div className="sub-feedback-section">
          <h3 className="sub-feedback-title">Your Recording:</h3>

          {q.CauTraLoi?.NoiDung ? (
            <audio controls className="question-audio-player">
              <source src={`${URLServer}${q.CauTraLoi.NoiDung}`} type="audio/webm" />
            </audio>
          ) : (
            <p className="sub-empty-text">No audio submitted.</p>
          )}

          <div>
            <p className="sub-score-text">
              Score: <span className="sub-score-value">{q.CauTraLoi?.DiemAI}</span>
            </p>

            <p className="sub-feedback-title mt-2">Feedback:</p>
            <div className="sub-ai-feedback-box">
              {q.CauTraLoi?.NhanXetAI || (
                <span className="sub-empty-text">No feedback available.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubQuestionItem;