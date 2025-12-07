import React from "react";
import { URLServer } from "@/api/apiConfig";

interface CreateQuestionItemProps {
  ch: any;
  idx: number;
  LOAI_CAU_HOI: string[];
  handleRemove: (idx: number) => void;
  cauHoiRieng: any[];
  setCauHoiRieng: (v: any[]) => void;
  questionIndex: number;
}

export default function CreateQuestionItem({
  ch,
  idx,
  LOAI_CAU_HOI,
  handleRemove,
  cauHoiRieng,
  setCauHoiRieng,
  questionIndex
}: CreateQuestionItemProps) {

  const audioSrc = ch.Audio instanceof File
    ? URL.createObjectURL(ch.Audio)
    : (ch.Audio ? `${URLServer}${ch.Audio}` : null);

  const audioName = ch.Audio instanceof File
    ? ch.Audio.name
    : (ch.Audio ? "Current Saved Audio" : "Upload Audio");

  return (
    <div className="create-question-card group">

      <div className="create-question-header">
        <div className="question-label-wrapper">
          <span className="question-badge">Question {questionIndex}</span>
          <span className="question-type-label">Normal Question</span>
        </div>
        <button
          onClick={() => handleRemove(idx)}
          className="btn-delete-question"
          title="Remove Question"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="input-question-content-wrapper">
        <input
          type="text"
          placeholder="Type your question content here..."
          className="input-question-content"
          value={ch.NoiDung}
          onChange={(e) => {
            const tmp = [...cauHoiRieng];
            tmp[idx].NoiDung = e.target.value;
            setCauHoiRieng(tmp);
          }}
        />
      </div>

      <div className="create-question-settings">

        <div className="setting-field col-type">
          <label className="setting-label">Type</label>
          <select
            value={ch.LoaiCauHoi}
            className="input-setting"
            onChange={(e) => {
              const tmp = [...cauHoiRieng];
              tmp[idx].LoaiCauHoi = e.target.value;

              if (["WRITING", "SPEAKING"].includes(e.target.value)) {
                tmp[idx].DapAn = [];
              } else if (tmp[idx].DapAn.length === 0) {
                tmp[idx].DapAn = Array(4).fill(0).map(() => ({ NoiDung: "", KetQua: false }));
              }
              setCauHoiRieng(tmp);
            }}
          >
            {LOAI_CAU_HOI.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="setting-field col-points">
          <label className="setting-label">Points</label>
          <input
            type="number"
            className="input-setting text-center"
            value={ch.Diem}
            onChange={(e) => {
              const tmp = [...cauHoiRieng];
              tmp[idx].Diem = Number(e.target.value);
              setCauHoiRieng(tmp);
            }}
          />
        </div>

        <div className="setting-field col-audio">
          <label className="setting-label">Audio Attachment</label>
          {audioSrc ? (
            <div className="flex items-center gap-2 w-full border border-blue-300 bg-blue-50 rounded-lg p-2">
              <audio controls src={audioSrc} className="h-8 w-full" />
              <button
                type="button"
                onClick={() => {
                  const tmp = [...cauHoiRieng];
                  tmp[idx].Audio = null;
                  setCauHoiRieng(tmp);
                }}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove Audio"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <p className="absolute bottom-0 w-full text-center text-[10px] text-green-700 font-semibold bg-white/80 py-0.5 truncate px-2">
                {audioName}
              </p>
            </div>
          ) : (
            <label className="upload-audio-box">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <span className="text-sm font-medium truncate">{audioName}</span>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const tmp = [...cauHoiRieng];
                  if (e.target.files) tmp[idx].Audio = e.target.files[0];
                  setCauHoiRieng(tmp);
                }}
              />
            </label>
          )}
        </div>
      </div>

      {ch.DapAn && ch.DapAn.length > 0 && (
        <div className="create-answers-list">
          {ch.DapAn.map((da: any, dIdx: number) => (
            <div key={dIdx} className="create-answer-item group/ans">

              <div className="radio-correct-wrapper">
                <input
                  type="radio"
                  name={`dapAnRieng-${idx}`}
                  className="radio-correct-input"
                  checked={da.KetQua}
                  onChange={() => {
                    const tmp = [...cauHoiRieng];
                    tmp[idx].DapAn.forEach((d: any, i: number) => (d.KetQua = i === dIdx));
                    setCauHoiRieng(tmp);
                  }}
                />
                <span className="radio-correct-dot"></span>
              </div>

              <input
                type="text"
                placeholder={`Answer option ${dIdx + 1}`}
                className={`input-answer-content ${da.KetQua ? 'is-correct' : ''}`}
                value={da.NoiDung}
                onChange={(e) => {
                  const tmp = [...cauHoiRieng];
                  tmp[idx].DapAn[dIdx].NoiDung = e.target.value;
                  setCauHoiRieng(tmp);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}