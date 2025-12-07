"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, UserPlus } from "lucide-react";
import AccountSearchBar from "../components/Layout/AccountSearchBar";
import AccountItem from "../components/AccountScreen/AccountItem";
import Pagination from "../components/Layout/Pagination";
import TotalCount from "../components/Layout/TotalCount";
import RegisterModal from "../components/AccountScreen/RegisterModal";
import { getAccounts, deleteAccount } from "../../api/apiAccount";
import { getTokenRole } from "@/api/getTokenRole";

export default function AccountManagerPage() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
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

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            setError(null);

            let query = "";
            if (searchValue.trim()) {
                query = `?searchType=${searchType}&searchValue=${encodeURIComponent(searchValue)}`;
            }

            const response = await getAccounts(query);
            setAccounts(response.accounts);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to load accounts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (role === "admin") {
            fetchAccounts();
        }
    }, [role]);

    const handleDelete = async (id: string) => {
        if (!confirm(`Are you sure you want to delete user "${id}"? This action cannot be undone.`)) return;

        try {
            setLoadingDeleteId(id);
            await deleteAccount(id);
            setAccounts((prev) => prev.filter((acc) => acc.IDTaiKhoan !== id));
            alert("Account deleted successfully!");
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to delete account");
        } finally {
            setLoadingDeleteId(null);
        }
    };

    const sortedAccounts = useMemo(() => {
        const list = [...accounts];
        if (sortByRecent) {
            return list.sort((a, b) => new Date(b.NgayTao).getTime() - new Date(a.NgayTao).getTime());
        }
        return list;
    }, [accounts, sortByRecent]);

    const totalPages = Math.ceil(sortedAccounts.length / itemsPerPage);
    const pagedAccounts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedAccounts.slice(start, start + itemsPerPage);
    }, [sortedAccounts, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (role !== "admin") return null;

    return (
        <section className="account-page-section">
            <button onClick={() => router.push("/")} className="btn-back">
                <ArrowLeft size={20} />
                Return
            </button>

            <TotalCount
                title="Account Management"
                statsLabel="Total Accounts"
                statsValue={accounts.length}
                icon={<Users size={20} />}
            />

            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
                <div className="w-full md:flex-1">
                    <AccountSearchBar
                        searchType={searchType}
                        setSearchType={setSearchType}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        onSearch={fetchAccounts}
                        sortByRecent={sortByRecent}
                        toggleSort={() => setSortByRecent(!sortByRecent)}
                    />
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-bold shadow-md hover:bg-green-700 hover:-translate-y-1 transition-all whitespace-nowrap h-[50px]"
                >
                    <UserPlus size={20} />
                    Create Account
                </button>
            </div>

            {loading && <p className="text-center text-gray-500 animate-pulse">Loading accounts...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && sortedAccounts.length === 0 && !error && (
                <p className="text-center text-gray-500 italic mt-10">No accounts found.</p>
            )}

            <div className="account-grid">
                {pagedAccounts.map((acc) => (
                    <div key={acc.IDTaiKhoan} className="account-grid-item">
                        <AccountItem
                            account={acc}
                            onDelete={handleDelete}
                            loadingDelete={loadingDeleteId === acc.IDTaiKhoan}
                        />
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {showCreateModal && (
                <RegisterModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        fetchAccounts();
                    }}
                />
            )}

        </section>
    );
}