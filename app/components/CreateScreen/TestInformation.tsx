import React from "react";
import { URLServer } from "@/api/apiConfig";

interface TestInformationProps {
    tenDeThi: string;
    setTenDeThi: (val: string) => void;
    loaiDeThi: string;
    setLoaiDeThi: (val: string) => void;
    soCauHoi: number;
    setSoCauHoi: (val: number) => void;
    mieuTa: string;
    setMieuTa: (val: string) => void;
    isHidden: boolean;
    setIsHidden: (val: boolean) => void;
    thoiGianLam: number;
    setThoiGianLam: (val: number) => void;
    image: File | null;
    setImage: (file: File | null) => void;
    LOAI_DE_THI: string[];
    previewImage?: string | null;
    setPreviewImage?: (val: string | null) => void;
}

export default function TestInformation({
    tenDeThi,
    setTenDeThi,
    loaiDeThi,
    setLoaiDeThi,
    soCauHoi,
    setSoCauHoi,
    mieuTa,
    setMieuTa,
    isHidden,
    setIsHidden,
    thoiGianLam,
    setThoiGianLam,
    image,
    setImage,
    LOAI_DE_THI,
    previewImage,
    setPreviewImage,
}: TestInformationProps) {

    const imageSrc = image
        ? URL.createObjectURL(image)
        : (previewImage ? `${URLServer}/images${previewImage}` : null);

    const imageName = image
        ? image.name
        : (previewImage ? "Current Saved Image" : "Upload Image File");

    return (
        <div className="test-info-card">

            <div className="test-info-header">
                <div className="test-info-accent-bar"></div>
                <h3 className="test-info-title">Test Information</h3>
            </div>

            <div className="test-info-grid">

                <div className="test-info-column">

                    <div className="form-group">
                        <label className="form-label">
                            Test Name <span className="required-asterisk">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: ETS 2024 Test 1"
                            className="form-input"
                            value={tenDeThi}
                            onChange={(e) => setTenDeThi(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Test Type <span className="required-asterisk">*</span>
                        </label>
                        <div className="select-wrapper">
                            <select
                                className="form-input form-select"
                                value={loaiDeThi}
                                onChange={(e) => setLoaiDeThi(e.target.value)}
                            >
                                <option value="">-- Select Type --</option>
                                {LOAI_DE_THI.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            <div className="select-arrow">▼</div>
                        </div>
                    </div>

                    <div className="form-row-grid">
                        <div className="form-group">
                            <label className="form-label">
                                Total Questions <span className="required-asterisk">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                className="form-input font-medium"
                                value={soCauHoi}
                                onChange={(e) => setSoCauHoi(Number(e.target.value))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Time (Sec) <span className="required-asterisk">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 2400"
                                className="form-input font-medium"
                                value={thoiGianLam}
                                onChange={(e) => setThoiGianLam(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                <div className="test-info-column">

                    <div className="form-group h-full">
                        <label className="form-label">Description</label>
                        <textarea
                            placeholder="Enter a brief description about this test..."
                            className="form-input form-textarea"
                            value={mieuTa}
                            onChange={(e) => setMieuTa(e.target.value)}
                        />

                        <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                id="isHidden"
                                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400 cursor-pointer"
                                checked={isHidden}
                                onChange={(e) => setIsHidden(e.target.checked)}
                            />
                            <label htmlFor="isHidden" className="font-semibold text-gray-700 cursor-pointer select-none">
                                Hide this test (Students cannot see it)
                            </label>
                        </div>

                        <div className="image-upload-container">
                            <label className="form-label mb-2 block">Test Image</label>
                            {imageSrc ? (
                                <div className="relative w-full h-32 border-2 border-orange-400 border-dashed rounded-xl overflow-hidden bg-orange-50 flex items-center justify-center group">
                                    <img
                                        src={imageSrc}
                                        alt="Preview"
                                        className="h-full w-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.src = `${URLServer}/images/tests/default.png`; 
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImage(null);
                                            if (setPreviewImage) {
                                                setPreviewImage(null);
                                            }
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                                        title="Change Image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>

                                    <p className="absolute bottom-0 w-full text-center text-xs text-orange-700 font-semibold bg-white/90 py-1 truncate px-2">
                                        {imageName}
                                    </p>
                                </div>
                            ) : (
                                <label className="image-upload-box group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <p className="upload-text-main">{imageName}</p>
                                        <p className="upload-text-sub">SVG, PNG, JPG</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => e.target.files && setImage(e.target.files[0])}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}