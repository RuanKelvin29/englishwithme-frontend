"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateTest, getTestForEdit } from "@/api/apiTest";
import { getTokenRole } from "@/api/getTokenRole";
import CreateQuestionItem from "@/app/components/CreateScreen/CreateQuestionItem";
import CreatePassageItem from "@/app/components/CreateScreen/CreatePassageItem";
import TestInformation from "@/app/components/CreateScreen/TestInformation";
import { ArrowLeft } from "lucide-react";

const LOAI_DE_THI = ["READING", "LISTENING", "WRITING", "SPEAKING", "HYBRID"];
const LOAI_CAU_HOI = ["READING", "LISTENING", "WRITING", "SPEAKING"];

export default function UpdateTestPage() {
    const router = useRouter();
    const { IDDeThi } = useParams();
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingButton, setLoadingButton] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tenDeThi, setTenDeThi] = useState("");
    const [loaiDeThi, setLoaiDeThi] = useState("");
    const [soCauHoi, setSoCauHoi] = useState(0);
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [mieuTa, setMieuTa] = useState("");
    const [isHidden, setIsHidden] = useState(false);
    const [thoiGianLam, setThoiGianLam] = useState(2400);
    const [doanVanList, setDoanVanList] = useState<any[]>([]);
    const [cauHoiRieng, setCauHoiRieng] = useState<any[]>([]);

    const soCauHoiTrongDoanVan = doanVanList.reduce((acc, dv) => acc + dv.CauHoi.length, 0);
    const currentTotalQuestions = cauHoiRieng.length + soCauHoiTrongDoanVan;
    const isLimitReached = soCauHoi > 0 && currentTotalQuestions >= soCauHoi;

    const draftKey = `edit_test_draft_${IDDeThi}`;

    useEffect(() => {
        const checkAndLoad = async () => {
            const r = getTokenRole();
            setRole(r);
            if (r !== "admin") {
                alert("Bạn không có quyền truy cập!");
                router.push("/");
                return;
            }

            try {
                const data = await getTestForEdit(IDDeThi as string);
                const info = data.test;
                const savedDraft = localStorage.getItem(draftKey);

                if (savedDraft) {
                    const userWantsRestore = confirm("Bạn có bản sửa đổi chưa lưu. Bạn có muốn khôi phục lại không?");
                    if (userWantsRestore) {
                        const parsed = JSON.parse(savedDraft);
                        setTenDeThi(parsed.tenDeThi || "");
                        setLoaiDeThi(parsed.loaiDeThi || "");
                        setSoCauHoi(parsed.soCauHoi || 0);
                        setPreviewImage(parsed.previewImage || null);
                        setMieuTa(parsed.mieuTa || "");
                        setIsHidden(parsed.isHidden || false)
                        setThoiGianLam(parsed.thoiGianLam || 2400);
                        setCauHoiRieng(parsed.cauHoiRieng || []);
                        setDoanVanList(parsed.doanVanList || []);
                        return;
                    } else {
                        localStorage.removeItem(draftKey);
                    }
                }

                setTenDeThi(info.TenDeThi);
                setLoaiDeThi(info.LoaiDeThi);
                setSoCauHoi(info.SoCauHoi);
                setMieuTa(info.MieuTa);
                setIsHidden(info.IsHidden)
                setThoiGianLam(info.ThoiGianLam);

                if (info.EncodeAnh) setPreviewImage(info.EncodeAnh);

                setCauHoiRieng(info.Part1 || []);
                setDoanVanList(info.Part2 || []);

            } catch (err: any) {
                console.error(err);
                setError("Không thể tải thông tin đề thi.");
            } finally {
                setIsLoaded(true);
                setLoading(false);
            }
        };

        if (IDDeThi) checkAndLoad();
    }, [IDDeThi]);

    useEffect(() => {
        if (!isLoaded) return;

        const draftData = {
            tenDeThi,
            loaiDeThi,
            soCauHoi,
            previewImage,
            mieuTa,
            isHidden,
            thoiGianLam,
            cauHoiRieng,
            doanVanList,
            timestamp: Date.now()
        };
        localStorage.setItem(draftKey, JSON.stringify(draftData));

    }, [tenDeThi, loaiDeThi, soCauHoi, previewImage, mieuTa, isHidden, thoiGianLam, cauHoiRieng, doanVanList, isLoaded]);

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
            setLoadingButton(false);
            return;
        }
        if (currentTotalQuestions > soCauHoi) {
            alert(`Số lượng câu hỏi vượt quá giới hạn! (${currentTotalQuestions}/${soCauHoi})`);
            setLoadingButton(false);
            return;
        }

        const formData = new FormData();
        formData.append("TenDeThi", tenDeThi);
        formData.append("LoaiDeThi", loaiDeThi);
        formData.append("SoCauHoi", soCauHoi.toString());
        formData.append("MieuTa", mieuTa);
        formData.append("IsHidden", isHidden ? "1" : "0");
        formData.append("ThoiGianLam", thoiGianLam.toString());

        if (image) {
            formData.append("TestImage", image);
        }

        formData.append("data", JSON.stringify({ DoanVan: doanVanList, CauHoiRieng: cauHoiRieng }));

        doanVanList.forEach((dv, i) => {
            if (dv.Image && dv.Image instanceof File) formData.append(`DoanVan[${i}].Image`, dv.Image);
            if (dv.Audio && dv.Audio instanceof File) formData.append(`DoanVan[${i}].Audio`, dv.Audio);
            dv.CauHoi.forEach((ch: any, j: any) => {
                if (ch.Audio && ch.Audio instanceof File) formData.append(`DoanVan[${i}].CauHoi[${j}].Audio`, ch.Audio);
            });
        });

        cauHoiRieng.forEach((ch, i) => {
            if (ch.Audio && ch.Audio instanceof File) formData.append(`CauHoiRieng[${i}].Audio`, ch.Audio);
        });

        try {
            const response = await updateTest(IDDeThi as string, formData);
            alert(response.message);
            localStorage.removeItem(draftKey);
            router.push(`/manage-tests/${IDDeThi}`);
        } catch (error: any) {
            console.error(error);
            setError(error.response?.data?.error || "Lỗi cập nhật");
            alert("Lỗi cập nhật đề thi");
        } finally {
            setLoadingButton(false);
        }
    };

    let questionIndex = 1;

    if (loading) return <p className="text-center mt-10 animate-pulse">Loading test data...</p>;
    if (role !== "admin") return null;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">

            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 py-3 px-6 mb-6 rounded-xl max-w-6xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push(`/manage-tests/${IDDeThi}`)} className="text-gray-500 hover:text-blue-600 transition">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Update Test: {tenDeThi}</h1>
                </div>

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
                        image={image}
                        setImage={setImage}
                        LOAI_DE_THI={LOAI_DE_THI}
                        previewImage={previewImage} setPreviewImage={setPreviewImage}
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
                                type="button" onClick={handleAddQuestion} disabled={!loaiDeThi}
                                className={`btn-add-dashed ${!loaiDeThi ? "btn-add-disabled" : "btn-add-blue"}`}
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
                            className={`btn-create-test ${loadingButton ? "loading" : isLimitReached ? "ready" : "not-ready"}`}
                        >
                            {loadingButton ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating Test...
                                </span>
                            ) : (
                                isLimitReached ? "Save Changes" : `Add ${soCauHoi - currentTotalQuestions} more questions`
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}