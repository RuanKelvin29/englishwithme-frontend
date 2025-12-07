"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSubmissionsByTestID, deleteSubmission } from "@/api/apiSubmission";
import { getTestByID } from "@/api/apiTest";
import { getTokenRole } from "@/api/getTokenRole";
import { ArrowLeft, Edit, ArrowUpDown, Clock, Trophy, FileText } from "lucide-react";
import SubItem from "@/app/components/SubScreen/SubItem";
import AccountSearchBar from "@/app/components/Layout/AccountSearchBar";
import TestItem from "@/app/components/TestScreen/TestItem";
import TotalCount from "@/app/components/Layout/TotalCount";
import Pagination from "@/app/components/Layout/Pagination";

export default function AdminTestDetailPage() {
    const { IDDeThi } = useParams();
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [testInfo, setTestInfo] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [searchType, setSearchType] = useState<"IDTaiKhoan" | "Email">("IDTaiKhoan");
    const [searchValue, setSearchValue] = useState("");
    const [sortByRecent, setSortByRecent] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const r = getTokenRole();
        setRole(r);
        if (r !== "admin") {
            alert("Bạn không có quyền truy cập!");
            router.push("/");
        }
    }, []);

    const fetchTest = async () => {
        try {
            setLoading(true);
            const testData = await getTestByID(IDDeThi as string);
            setTestInfo(testData.test);
        } catch (error: any) {
            console.error(error);
            alert(error.response.data.error || "Lỗi khi lấy đề thi");
        }
    };

    const fetchSubs = async () => {
        try {
            let query = "";
            if (searchValue.trim()) {
                query = `?searchType=${searchType}&searchValue=${encodeURIComponent(searchValue)}`;
            }
            const subData = await getSubmissionsByTestID(IDDeThi as string, query);
            setSubmissions(subData.submissions);
        } catch (error: any) {
            console.error(error);
            alert(error.response.data.error || "Lỗi khi lấy bài thi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (role === "admin") fetchTest();
    }, [role]);

    useEffect(() => {
        if (testInfo) {
            fetchSubs();
        }
    }, [testInfo]);

    const handleDeleteSub = async (IDBaiThi: string) => {
        if (!confirm("Xóa bài thi này?")) return;
        try {
            setLoadingDelete(true);
            await deleteSubmission(IDBaiThi);
            setSubmissions(prev => prev.filter(s => s.IDBaiThi !== IDBaiThi));
        } catch (e) { alert("Lỗi khi xóa bài thi"); }
        finally { setLoadingDelete(false); }
    };

    const sortedSubmissions = useMemo(() => {
        const list = [...submissions];
        if (sortByRecent) {
            return list.sort((a, b) => new Date(b.ThoiGianBatDau).getTime() - new Date(a.ThoiGianBatDau).getTime());
        }
        return list;
    }, [submissions, sortByRecent]);

    const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage);
    const pagedSubs = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedSubmissions.slice(start, start + itemsPerPage);
    }, [sortedSubmissions, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (role !== "admin") return null;

    return (
        <section className="submissions-page-section">
            <button onClick={() => router.push(`/manage-tests`)} className="btn-back mb-6">
                <ArrowLeft size={20} /> Return to List
            </button>

            {loading ? (
                <p className="text-center text-gray-500 animate-pulse mt-10">Loading data...</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                    <div className="lg:col-span-1 space-y-6">
                        <div className="sticky top-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">Test Information</h2>

                            {testInfo && (
                                <div className="test-grid-item relative group">
                                    <div className={testInfo.IsHidden ? "opacity-50 grayscale" : ""}>
                                        <TestItem
                                            IDDeThi={testInfo.IDDeThi}
                                            TenDeThi={testInfo.TenDeThi}
                                            LoaiDeThi={testInfo.LoaiDeThi}
                                            EncodeAnh={testInfo.EncodeAnh}
                                            MieuTa={testInfo.MieuTa}
                                            SoCauHoi={testInfo.SoCauHoi}
                                            NgayTao={testInfo.NgayTao}
                                            customHref={`/manage-tests/${IDDeThi}/update`}
                                        />
                                    </div>

                                    {testInfo.IsHidden && (
                                        <span className="absolute top-2 left-2 z-20 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                                            HIDDEN
                                        </span>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={() => router.push(`/manage-tests/${IDDeThi}/update`)}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-1 transition-all"
                            >
                                <Edit size={20} />
                                Edit Test
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2">

                        <div className="mb-6">
                            <TotalCount
                                title="Submission Statistics"
                                statsLabel="Total Subs"
                                statsValue={submissions.length}
                                icon={<FileText size={20} />}
                            />
                        </div>

                        <div className="flex flex-wrap justify-between items-center mb-6 gap-4 border-b border-gray-200 pb-4">
                            <h2 className="text-xl font-bold text-gray-800">Student Results</h2>

                            <AccountSearchBar
                                searchType={searchType}
                                setSearchType={setSearchType}
                                searchValue={searchValue}
                                setSearchValue={setSearchValue}
                                onSearch={fetchSubs}
                                sortByRecent={sortByRecent}
                                toggleSort={() => setSortByRecent(!sortByRecent)}
                            />


                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                            >
                                Sort by:
                                <span className={`flex items-center gap-1 ${!sortByRecent ? 'text-green-600' : 'text-gray-500'}`}>
                                    <Trophy size={14} /> Score
                                </span>
                                <span className="text-gray-300">|</span>
                                <span className={`flex items-center gap-1 ${sortByRecent ? 'text-blue-600' : 'text-gray-500'}`}>
                                    <Clock size={14} /> Date
                                </span>
                            </button>
                        </div>

                        {sortedSubmissions.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 italic">No one has done this submission before.</p>
                            </div>
                        ) : (
                            <div className="submissions-grid">
                                {pagedSubs.map((s: any) => (
                                    <div key={s.IDBaiThi} className="submission-item-wrapper">
                                        <SubItem
                                            submission={{
                                                ...s,
                                                TenDeThi: `${s.IDTaiKhoan} - ${s.NguoiLam}`
                                            }}
                                            handleDelete={handleDeleteSub}
                                            loadingDelete={loadingDelete}
                                            source={`accounts/${s.IDTaiKhoan}/${s.IDBaiThi}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />

                    </div>
                </div>
            )}
        </section>
    );
}