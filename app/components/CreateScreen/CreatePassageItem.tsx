"use client";
import React from "react";
import CreateQuestionPassageItem from "./CreateQuestionPassageItem";
import { URLServer } from "@/api/apiConfig";

interface CreatePassageItemProps {
    dv: any;
    idx: number;
    doanVanList: any[];
    setDoanVanList: (v: any[]) => void;
    handleRemovePassage: (idx: number) => void;
    handleAddQuestionPassage: (idx: number) => void;
    handleRemoveQuestionPassage: (idx: number, cIdx: number) => void;
    questionStartIndex: number;
    LOAI_CAU_HOI: string[];
    isLimitReached: boolean;
    loaiDeThi: string;
}

export default function CreatePassageItem({
    dv,
    idx,
    doanVanList,
    setDoanVanList,
    handleRemovePassage,
    handleAddQuestionPassage,
    handleRemoveQuestionPassage,
    questionStartIndex,
    LOAI_CAU_HOI,
    isLimitReached,
    loaiDeThi
}: CreatePassageItemProps) {

    const imageSrc = dv.Image 
    ? URL.createObjectURL(dv.Image)
    : (dv.EncodeAnh ? `${URLServer}/images${dv.EncodeAnh}` : null);

    const imageName = dv.Image 
    ? dv.Image.name 
    : (dv.EncodeAnh ? "Current Saved Image" : "Upload Image File");

    const audioSrc = dv.Audio instanceof File 
    ? URL.createObjectURL(dv.Audio) 
    : (dv.Audio ? `${URLServer}${dv.Audio}` : null); 

    const audioName = dv.Audio instanceof File 
    ? dv.Audio.name 
    : (dv.Audio ? "Current Saved Audio" : "Upload Audio File");

    return (
        <div className="passage-container-wrapper group">
            <div className="passage-decoration-bar"></div>

            <div className="passage-top-row">
                <h3 className="passage-title">Passage {idx + 1}</h3>
                <button
                    onClick={() => handleRemovePassage(idx)}
                    className="btn-remove-passage"
                    title="Delete entire passage"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove Passage
                </button>
            </div>

            <div className="passage-main-grid">
                <div className="passage-col-content">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Content</label>
                    <textarea
                        placeholder="Enter passage text..."
                        className="w-full h-40 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm transition-all resize-none"
                        value={dv.NoiDung}
                        onChange={(e) => {
                            const tmp = [...doanVanList];
                            tmp[idx].NoiDung = e.target.value;
                            setDoanVanList(tmp);
                        }}
                    />
                </div>

                <div className="passage-col-media">
                    <div className="flex-1 flex flex-col">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Passage Image</label>
                        {imageSrc ? (
                            <div className="relative w-full h-32 border border-green-300 bg-green-50 rounded-xl overflow-hidden flex items-center justify-center group/img">
                                <img src={imageSrc} alt="Preview" className="h-full object-contain" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const tmp = [...doanVanList];
                                        tmp[idx].Image = null;
                                        setDoanVanList(tmp);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 transition"
                                    title="Remove Image"
                                >
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                                <p className="absolute bottom-0 w-full text-center text-[10px] text-green-700 font-semibold bg-white/80 py-0.5 truncate px-2">
                                    {imageName}
                                </p>
                            </div>
                        ) : (
                            <label className="passage-upload-box inactive h-32 flex flex-col justify-center">
                                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span className="text-xs font-medium">{imageName}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const tmp = [...doanVanList]; if (e.target.files) tmp[idx].Image = e.target.files[0]; setDoanVanList(tmp); }} />
                            </label>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Passage Audio</label>
                        {audioSrc ? (
                            <div className="flex items-center gap-2 w-full border border-green-300 bg-green-50 rounded-lg p-2 h-full">
                                <audio controls src={audioSrc} className="h-8 w-full" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const tmp = [...doanVanList];
                                        tmp[idx].Audio = null;
                                        setDoanVanList(tmp);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                    title="Remove Audio"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <p className="absolute bottom-0 w-full text-center text-[10px] text-green-700 font-semibold bg-white/80 py-0.5 truncate px-2">
                                    {audioName}
                                </p>
                            </div>
                        ) : (
                            <label className="passage-upload-box inactive h-full">
                                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                <span className="text-xs font-medium truncate px-2">{audioName}</span>
                                <input type="file" accept="audio/*" className="hidden" onChange={(e) => { const tmp = [...doanVanList]; if (e.target.files) tmp[idx].Audio = e.target.files[0]; setDoanVanList(tmp); }} />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            <div className="passage-questions-container">
                <h4 className="passage-questions-label">Questions</h4>

                {dv.CauHoi.map((ch: any, cIdx: number) => (
                    <CreateQuestionPassageItem
                        key={cIdx}
                        ch={ch}
                        idxDoan={idx}
                        idxCau={cIdx}
                        questionIndex={questionStartIndex + cIdx}
                        LOAI_CAU_HOI={LOAI_CAU_HOI}
                        doanVanList={doanVanList}
                        setDoanVanList={setDoanVanList}
                        handleRemoveCauHoiDoan={handleRemoveQuestionPassage}
                    />
                ))}

                {!isLimitReached && (
                    <button
                        type="button"
                        onClick={() => handleAddQuestionPassage(idx)}
                        disabled={!loaiDeThi}
                        className={`btn-add-dashed mt-4 ${!loaiDeThi ? "btn-add-disabled" : "btn-add-green"}`}
                    >
                        <span className="text-xl">+</span> Add Question to Passage
                    </button>
                )}
            </div>
        </div>
    );
}