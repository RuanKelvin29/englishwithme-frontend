"use client";
import React, { useState, useRef } from "react";
import { URLServer } from "@/api/apiConfig";
import { uploadAudio } from "@/api/apiUpload";

interface TestQuestionItemProps {
  q: any;
  answers: { [key: string]: string };
  handleAnswerChange: (IDCauHoi: string, IDDapAn: string) => void;
  IDBaiThi: any;
  questionIndex: number;
  color: "blue" | "green";
}

const TestQuestionItem: React.FC<TestQuestionItemProps> = ({
  q,
  answers,
  handleAnswerChange,
  IDBaiThi,
  questionIndex,
  color,
}) => {
  const type = q.LoaiCauHoi;
  const isAnswered = !!answers[q.IDCauHoi];

  const recorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      let localChunks: Blob[] = [];

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          localChunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(localChunks, { type: "audio/webm" });
        console.log("Kích thước file ghi âm:", blob.size);

        if (blob.size < 100) {
          alert("File ghi âm quá ngắn hoặc bị lỗi!");
          return;
        }

        const formData = new FormData();
        formData.append("IDCauHoi", q.IDCauHoi);
        formData.append("IDBaiThi", IDBaiThi);
        formData.append("audio", blob, "recording.webm");

        try {
          const response = await uploadAudio(formData);
          const urlWithTimestamp = `${response.fileUrl}?t=${new Date().getTime()}`;
          handleAnswerChange(q.IDCauHoi, urlWithTimestamp);
        } catch (error: any) {
          console.error(error);
          alert(error.response?.data?.error || "Lỗi upload");
        }

        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(200);
      recorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      console.error("Không thể truy cập microphone:", err);
      alert("Vui lòng cấp quyền truy cập microphone!");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div
      className={`test-question-item theme-${color} ${
        isAnswered ? "answered" : ""
      }`}
    >
      <p className="question-text">
        Question {questionIndex}: {q.NoiDung}
      </p>

      {q.Audio && (
        <audio controls src={`${URLServer}${q.Audio}`} className="question-audio-player">
          Trình duyệt không hỗ trợ audio
        </audio>
      )}

      {(type === "READING" || type === "LISTENING") && (
        <ul className="answers-list">
          {q.DapAn?.map((a: any) => {
            const isSelected = answers[q.IDCauHoi] === a.IDDapAn;
            return (
              <li key={a.IDDapAn}>
                <label className={`answer-label ${isSelected ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name={q.IDCauHoi}
                    value={a.IDDapAn}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(q.IDCauHoi, a.IDDapAn)}
                    className="answer-radio"
                  />
                  <span className="text-gray-800">{a.NoiDung}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {type === "WRITING" && (
        <textarea
          className="writing-textarea"
          rows={4}
          placeholder="Write your answer here..."
          value={answers[q.IDCauHoi] || ""}
          onChange={(e) => handleAnswerChange(q.IDCauHoi, e.target.value)}
        ></textarea>
      )}

      {type === "SPEAKING" && (
        <div className="speaking-section">
          {!recording && (
            <button onClick={startRecording} className="btn-record btn-record-start">
              🎙️ Start Recording
            </button>
          )}

          {recording && (
            <button onClick={stopRecording} className="btn-record btn-record-stop">
              ⏹ Stop Recording
            </button>
          )}

          {answers[q.IDCauHoi] && (
            <audio controls className="question-audio-player mt-2" key={answers[q.IDCauHoi]}>
              <source src={`${URLServer}${answers[q.IDCauHoi]}`} type="audio/webm" />
            </audio>
          )}
        </div>
      )}
    </div>
  );
};

export default TestQuestionItem;