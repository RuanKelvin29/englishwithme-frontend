"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createTest } from "../../api/apiTest";
import { getTokenRole } from "../../api/getTokenRole";
import CreateQuestionItem from "../components/CreateScreen/CreateQuestionItem"
import CreatePassageItem from "../components/CreateScreen/CreatePassageItem";
import TestInformation from "../components/CreateScreen/TestInformation";

const LOAI_DE_THI = ["READING", "LISTENING", "WRITING", "SPEAKING", "HYBRID"];
const LOAI_CAU_HOI = ["READING", "LISTENING", "WRITING", "SPEAKING"];

export default function CreateTestForm() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingButton, setLoadingButton] = useState(false);
    const [error, setError] = useState(false);
    const [tenDeThi, setTenDeThi] = useState("");
    const [loaiDeThi, setLoaiDeThi] = useState("");
    const [soCauHoi, setSoCauHoi] = useState(0);
    const [image, setImage] = useState<File | null>(null);
    const [mieuTa, setMieuTa] = useState("");
    const [isHidden, setIsHidden] = useState(false);
    const [thoiGianLam, setThoiGianLam] = useState(2400);
    const [doanVanList, setDoanVanList] = useState<any[]>([]);
    const [cauHoiRieng, setCauHoiRieng] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const soCauHoiTrongDoanVan = doanVanList.reduce((acc, dv) => acc + dv.CauHoi.length, 0);
    const currentTotalQuestions = cauHoiRieng.length + soCauHoiTrongDoanVan;
    const isLimitReached = soCauHoi > 0 && currentTotalQuestions >= soCauHoi;

    useEffect(() => {
        const r = getTokenRole();
        setRole(r);
        if (r !== "admin") {
            alert("Bạn không có quyền truy cập!");
            router.push("/");
        }
    }, []);

    useEffect(() => {
        const savedDraft = localStorage.getItem("create_test_draft");
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                setTenDeThi(parsed.tenDeThi || "");
                setLoaiDeThi(parsed.loaiDeThi || "");
                setSoCauHoi(parsed.soCauHoi || 0);
                setMieuTa(parsed.mieuTa || "");
                setIsHidden(parsed.isHidden || false)
                setThoiGianLam(parsed.thoiGianLam || 2400);
                setCauHoiRieng(parsed.cauHoiRieng || []);
                setDoanVanList(parsed.doanVanList || []);
            } catch (e) {
                console.error("Lỗi khôi phục bản nháp:", e);
            }
        }
        setIsLoaded(true);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        const draftData = {
            tenDeThi,
            loaiDeThi,
            soCauHoi,
            mieuTa,
            isHidden,
            thoiGianLam,
            cauHoiRieng,
            doanVanList,
        };

        localStorage.setItem("create_test_draft", JSON.stringify(draftData));
        setLoading(false);
    }, [tenDeThi, loaiDeThi, soCauHoi, mieuTa, isHidden, thoiGianLam, cauHoiRieng, doanVanList, isLoaded]);

    if (loading) return <p className="text-center text-gray-500 text-lg animate-pulse mt-10">Loading...</p>;
    if (role !== "admin") return null;

    const createQuestion = (type: string = "READING") => {
        const isMultipleChoice = ["READING", "LISTENING"].includes(type);
        return {
            NoiDung: "",
            Audio: null,
            Diem: isMultipleChoice ? 5 : 100,
            LoaiCauHoi: type,
            DapAn: isMultipleChoice
                ? Array(4).fill(0).map(() => ({ NoiDung: "", KetQua: false }))
                : [],
        };
    };

    const handleAddPassage = () => {
        setDoanVanList([...doanVanList, { NoiDung: "", Image: null, Audio: null, CauHoi: [] }]);
    };

    const handleRemovePassage = (idx: number) => {
        setDoanVanList(doanVanList.filter((_, i) => i !== idx));
    };

    const handleAddQuestionPassage = (idx: number) => {
        let defaultType = "READING";
        if (loaiDeThi && loaiDeThi !== "HYBRID") {
            defaultType = loaiDeThi;
        }

        const updated = [...doanVanList];
        updated[idx].CauHoi.push(createQuestion(defaultType));
        setDoanVanList(updated);
    };

    const handleRemoveQuestionPassage = (idx: number, cIdx: number) => {
        const updated = [...doanVanList];
        updated[idx].CauHoi = updated[idx].CauHoi.filter((_: any, i: number) => i !== cIdx);
        setDoanVanList(updated);
    };

    const handleAddQuestion = () => {
        let defaultType = "READING";
        if (loaiDeThi && loaiDeThi !== "HYBRID") {
            defaultType = loaiDeThi;
        }
        setCauHoiRieng([...cauHoiRieng, createQuestion(defaultType)]);
    };

    const handleRemoveQuestion = (idx: number) => {
        setCauHoiRieng(cauHoiRieng.filter((_: any, i: number) => i !== idx));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoadingButton(true);

        if (currentTotalQuestions < soCauHoi) {
            alert(`Bạn chưa tạo đủ số câu hỏi yêu cầu! (${currentTotalQuestions}/${soCauHoi})`);
            return;
        }
        if (currentTotalQuestions > soCauHoi) {
            alert(`Số lượng câu hỏi vượt quá giới hạn cho phép! (${currentTotalQuestions}/${soCauHoi})`);
            return;
        }

        const formData = new FormData();
        formData.append("TenDeThi", tenDeThi);
        formData.append("LoaiDeThi", loaiDeThi);
        formData.append("SoCauHoi", soCauHoi.toString());
        formData.append("MieuTa", mieuTa);
        formData.append("IsHidden", isHidden ? "1" : "0");
        formData.append("ThoiGianLam", thoiGianLam.toString());
        if (image) formData.append("TestImage", image);
        formData.append("data", JSON.stringify({ DoanVan: doanVanList, CauHoiRieng: cauHoiRieng }));

        doanVanList.forEach((dv, i) => {
            if (dv.Image) formData.append(`DoanVan[${i}].Image`, dv.Image);
            if (dv.Audio) formData.append(`DoanVan[${i}].Audio`, dv.Audio);
            dv.CauHoi.forEach((ch: any, j: any) => {
                if (ch.Audio) formData.append(`DoanVan[${i}].CauHoi[${j}].Audio`, ch.Audio);
            });
        });

        cauHoiRieng.forEach((ch, i) => {
            if (ch.Audio) formData.append(`CauHoiRieng[${i}].Audio`, ch.Audio);
        });

        try {
            const response = await createTest(formData);
            alert(response.message);
            localStorage.removeItem("create_test_draft");
            router.push("/test");
        } catch (error: any) {
            console.error(error);
            setLoadingButton(false);
            setError(error.response.data.error);
            alert(error.response?.data?.error || "Lỗi server");
        }
    };

    let questionIndex = 1;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 py-3 px-6 mb-6 rounded-xl max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Create New Test</h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-gray-600">
                        Progress: <span className={`font-bold ${currentTotalQuestions === soCauHoi ? 'text-green-600' : 'text-orange-500'}`}>{currentTotalQuestions}</span> / {soCauHoi} Questions
                    </div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${currentTotalQuestions >= soCauHoi ? 'bg-green-500' : 'bg-orange-400'}`}
                            style={{ width: `${Math.min((currentTotalQuestions / (soCauHoi || 1)) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {error && <p className="text-center text-red-500 mt-10">{error}</p>}

            <div className="max-w-6xl mx-auto">
                <form onSubmit={(e) => e.preventDefault()}>

                    <TestInformation
                        tenDeThi={tenDeThi} setTenDeThi={setTenDeThi}
                        loaiDeThi={loaiDeThi} setLoaiDeThi={setLoaiDeThi}
                        soCauHoi={soCauHoi} setSoCauHoi={setSoCauHoi}
                        mieuTa={mieuTa} setMieuTa={setMieuTa}
                        isHidden={isHidden} setIsHidden={setIsHidden}
                        thoiGianLam={thoiGianLam} setThoiGianLam={setThoiGianLam}
                        image={image} setImage={setImage}
                        LOAI_DE_THI={LOAI_DE_THI}
                    />

                    <div className="part-section-card">
                        <div className="part-header">
                            <h2 className="part-title-blue">PART 1</h2>
                            <span className="part-badge-blue">{cauHoiRieng.length} Questions</span>
                        </div>

                        {cauHoiRieng.map((ch, idx) => (
                            <CreateQuestionItem
                                key={idx} ch={ch} idx={idx}
                                LOAI_CAU_HOI={LOAI_CAU_HOI}
                                handleRemove={handleRemoveQuestion}
                                cauHoiRieng={cauHoiRieng}
                                setCauHoiRieng={setCauHoiRieng}
                                questionIndex={questionIndex++}
                            />
                        ))}

                        {!isLimitReached && (
                            <button
                                type="button"
                                onClick={handleAddQuestion}
                                disabled={!loaiDeThi}
                                className={`btn-add-dashed ${!loaiDeThi ? "btn-add-disabled" : "btn-add-blue"
                                    }`}
                            >
                                <span className="text-xl">+</span> Add Question
                            </button>
                        )}
                    </div>

                    <div className="part-section-card">
                        <div className="part-header">
                            <h2 className="part-title-green">PART 2</h2>
                            <span className="part-badge-green">{doanVanList.length} Passages</span>
                        </div>

                        {doanVanList.map((dv, idx) => {
                            const startIdx = cauHoiRieng.length + doanVanList.slice(0, idx).reduce((sum, p) => sum + p.CauHoi.length, 0) + 1;

                            return (
                                <CreatePassageItem
                                    key={idx}
                                    dv={dv}
                                    idx={idx}
                                    doanVanList={doanVanList}
                                    setDoanVanList={setDoanVanList}
                                    handleRemovePassage={handleRemovePassage}
                                    handleAddQuestionPassage={handleAddQuestionPassage}
                                    handleRemoveQuestionPassage={handleRemoveQuestionPassage}
                                    questionStartIndex={startIdx}
                                    LOAI_CAU_HOI={LOAI_CAU_HOI}
                                    isLimitReached={isLimitReached}
                                    loaiDeThi={loaiDeThi}
                                />
                            );
                        })}

                        {!isLimitReached && (
                            <button
                                type="button"
                                onClick={handleAddPassage}
                                className={`btn-add-dashed ${!loaiDeThi ? "btn-add-disabled" : "btn-add-green"}`}>
                                <span className="text-xl">+</span> Add New Passage
                            </button>
                        )}
                    </div>

                    <div className="create-test-submit-btn-container">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loadingButton || !isLimitReached}
                            className={`btn-create-test ${loadingButton
                                ? "loading"
                                : isLimitReached
                                    ? "ready"
                                    : "not-ready"
                                }`}
                        >
                            {loadingButton ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Test...
                                </span>
                            ) : (
                                isLimitReached
                                    ? "Finish & Create Test"
                                    : `Add ${soCauHoi - currentTotalQuestions} more questions to Finish`
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
