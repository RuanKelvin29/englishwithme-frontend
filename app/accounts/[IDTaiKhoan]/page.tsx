"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAccountByID } from "@/api/apiAccount";
import { deleteSubmission } from "@/api/apiSubmission";
import { ArrowLeft, FileText } from "lucide-react";
import { getTokenRole } from "@/api/getTokenRole";
import SubItem from "../../components/SubScreen/SubItem";
import SearchBar from "../../components/Layout/SearchBar";
import Pagination from "../../components/Layout/Pagination";
import TotalCount from "../../components/Layout/TotalCount";
import AccountUserProfile from "../../components/AccountScreen/AccountUserProfile";

export default function UserSubmissionsPage() {
    const { IDTaiKhoan } = useParams();
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [searchType, setSearchType] = useState<"TenDeThi" | "LoaiDeThi">("TenDeThi");
    const [searchValue, setSearchValue] = useState<string>("");
    const [sortByRecent, setSortByRecent] = useState<boolean>(false);
    const [subs, setSubs] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const r = getTokenRole();
        setRole(r);
        if (r !== "admin") {
            alert("Bạn không có quyền truy cập!");
            router.push("/");
        }
    }, []);

    const fetchSubs = async () => {
        try {
            setLoading(true);
            setError(null);

            let query = "";
            if (searchValue.trim()) {
                query = `?searchType=${encodeURIComponent(searchType)}&searchValue=${encodeURIComponent(searchValue)}`;
            }

            const data = await getAccountByID(IDTaiKhoan, query);
            setSubs(data.submissions);
            setUserInfo(data.user);

        } catch (error: any) {
            console.error(error);
            const message = error?.response?.data?.error || "Lỗi khi lấy danh sách bài thi";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (role === "admin") {
            fetchSubs();
        }
    }, [role]);

    const handleDelete = async (IDBaiThi: string) => {
        if (!confirm(`Bạn có chắc muốn xóa bài thi này của ${IDTaiKhoan}?`)) return;

        try {
            setLoadingDelete(true);
            const data = await deleteSubmission(IDBaiThi);
            setSubs((prev) => prev.filter((sub) => sub.IDBaiThi !== IDBaiThi));
            alert(data.message);
        } catch (error: any) {
            console.error(error);
            alert(error.response.data.error);
        } finally {
            setLoadingDelete(false);
        }
    };

    const sortedSubs = useMemo(() => {
        const list = [...subs];
        if (sortByRecent) {
            return list.sort((a, b) => new Date(b.ThoiGianBatDau).getTime() - new Date(a.ThoiGianBatDau).getTime());
        }
        return list;
    }, [subs, sortByRecent]);

    const totalPages = Math.ceil(sortedSubs.length / itemsPerPage);
    const pagedSubs = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedSubs.slice(start, start + itemsPerPage);
    }, [sortedSubs, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (role !== "admin") return null;

    return (
        <section className="submissions-page-section">
            <button onClick={() => router.push("/accounts")} className="btn-back mb-6">
                <ArrowLeft size={20} />
                Back to Accounts
            </button>

            <div className="max-w-6xl mx-auto">
                
                {userInfo ? (
                    <AccountUserProfile 
                        initialUser={userInfo} 
                        onUserUpdated={(updated) => setUserInfo(updated)} 
                    />
                ) : (
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 animate-pulse h-64"></div>
                )}
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-t border-gray-200 pt-8">
                    <h2 className="text-2xl font-bold text-gray-800">Submission History</h2>
                    
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <div className="bg-green-50 p-1.5 rounded-md text-green-600">
                            <FileText size={18} />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase block">Total Subs</span>
                            <span className="text-lg font-extrabold text-gray-800 leading-none">{subs.length}</span>
                        </div>
                    </div>
                </div>

                <SearchBar
                    searchType={searchType}
                    setSearchType={setSearchType}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    onSearch={fetchSubs}
                    sortByRecent={sortByRecent}
                    toggleSort={() => setSortByRecent(!sortByRecent)}
                />

                {loading && <p className="submission-status-msg animate-pulse-text">Loading submissions...</p>}
                {error && <p className="submission-status-msg error">{error}</p>}
                {!loading && sortedSubs.length === 0 && !error && (
                    <p className="submission-status-msg empty">This user hasn't taken any tests yet.</p>
                )}

                <div className="submissions-grid">
                    {pagedSubs.map((s) => (
                        <div key={s.IDBaiThi} className="submission-item-wrapper">
                            <SubItem
                                submission={s}
                                handleDelete={handleDelete}
                                loadingDelete={loadingDelete}
                                source={`/admin/accounts/${IDTaiKhoan}/${s.IDBaiThi}`}
                            />
                        </div>
                    ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </section>
    );
}