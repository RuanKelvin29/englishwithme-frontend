import React from "react";
import { URLServer } from "@/api/apiConfig";

interface CreateQuestionPassageItemProps {
  ch: any;
  idxDoan: number;
  idxCau: number;
  questionIndex: number;
  LOAI_CAU_HOI: string[];
  doanVanList: any[];
  setDoanVanList: (v: any[]) => void;
  handleRemoveCauHoiDoan: (idxDoan: number, idxCau: number) => void;
}

export default function CreateQuestionPassageItem({
  ch,
  idxDoan,
  idxCau,
  questionIndex,
  LOAI_CAU_HOI,
  doanVanList,
  setDoanVanList,
  handleRemoveCauHoiDoan
}: CreateQuestionPassageItemProps) {

  const audioSrc = ch.Audio instanceof File
    ? URL.createObjectURL(ch.Audio)
    : (ch.Audio ? `${URLServer}${ch.Audio}` : null);

  const audioName = ch.Audio instanceof File
    ? ch.Audio.name
    : (ch.Audio ? "Current Saved Audio" : "Upload Audio");

  return (
    <div className="passage-question-card">

      <div className="passage-line"></div>

      <div className="passage-header">
        <h4 className="passage-badge">Question {questionIndex}</h4>

        <button
          onClick={() => handleRemoveCauHoiDoan(idxDoan, idxCau)}
          className="btn-delete-question"
          title="Remove Question"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <input
        type="text"
        placeholder="Passage question content..."
        className="passage-input-content"
        value={ch.NoiDung}
        onChange={(e) => {
          const tmp = [...doanVanList];
          tmp[idxDoan].CauHoi[idxCau].NoiDung = e.target.value;
          setDoanVanList(tmp);
        }}
      />

      <div className="passage-settings-row">
        <div className="md:col-span-4">
          <select
            value={ch.LoaiCauHoi}
            className="passage-select"
            onChange={(e) => {
              const tmp = [...doanVanList];
              tmp[idxDoan].CauHoi[idxCau].LoaiCauHoi = e.target.value;

              if (["WRITING", "SPEAKING"].includes(e.target.value)) {
                tmp[idxDoan].CauHoi[idxCau].DapAn = [];
              } else if (tmp[idxDoan].CauHoi[idxCau].DapAn.length === 0) {
                tmp[idxDoan].CauHoi[idxCau].DapAn = Array(4).fill(0).map(() => ({ NoiDung: "", KetQua: false }));
              }
              setDoanVanList(tmp);
            }}
          >
            {LOAI_CAU_HOI.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <input
            type="number"
            placeholder="Pts"
            className="passage-input-points"
            value={ch.Diem}
            onChange={(e) => {
              const tmp = [...doanVanList];
              tmp[idxDoan].CauHoi[idxCau].Diem = Number(e.target.value);
              setDoanVanList(tmp);
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
                  const tmp = [...doanVanList];
                  tmp[idxDoan].CauHoi[idxCau].Audio = null;
                  setDoanVanList(tmp);
                }}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove Audio"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
              <p className="absolute bottom-0 w-full text-center text-[10px] text-green-700 font-semibold bg-white/80 py-0.5 truncate px-2">
                {audioName}
              </p>
            </div>
          ) : (
            <label className="upload-audio-box">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
              <span className="text-sm font-medium truncate">{audioName}</span>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const tmp = [...doanVanList];
                  if (e.target.files) {
                    tmp[idxDoan].CauHoi[idxCau].Audio = e.target.files[0];
                  }
                  setDoanVanList(tmp);
                }}
              />
            </label>
          )}
        </div>

      </div>

      {ch.DapAn && ch.DapAn.length > 0 && (
        <div className="passage-answers-grid">
          {ch.DapAn.map((da: any, dIdx: number) => (
            <div key={dIdx} className="passage-answer-wrapper">
              <input
                type="radio"
                name={`dapAn-${idxDoan}-${idxCau}`}
                className="passage-radio"
                checked={da.KetQua}
                onChange={() => {
                  const tmp = [...doanVanList];
                  tmp[idxDoan].CauHoi[idxCau].DapAn.forEach(
                    (d: any, i: number) => (d.KetQua = i === dIdx)
                  );
                  setDoanVanList(tmp);
                }}
              />
              <input
                type="text"
                placeholder={`Answer ${dIdx + 1}`}
                className={`passage-input-answer ${da.KetQua ? 'selected' : ''}`}
                value={da.NoiDung}
                onChange={(e) => {
                  const tmp = [...doanVanList];
                  tmp[idxDoan].CauHoi[idxCau].DapAn[dIdx].NoiDung = e.target.value;
                  setDoanVanList(tmp);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}