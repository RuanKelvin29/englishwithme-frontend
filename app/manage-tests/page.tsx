"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getTests, toggleTestVisibility } from "../../api/apiTest";
import { getTokenRole } from "@/api/getTokenRole";
import { FileText, Eye, EyeOff, Filter } from "lucide-react";
import TestItem, { Test } from "../components/TestScreen/TestItem";
import SearchBar from "../components/Layout/SearchBar";
import Pagination from "../components/Layout/Pagination";
import TotalCount from "../components/Layout/TotalCount";

export default function AdminTestPage() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [searchType, setSearchType] = useState<"TenDeThi" | "LoaiDeThi">("TenDeThi");
  const [role, setRole] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortByRecent, setSortByRecent] = useState<boolean>(false);
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = "?viewMode=admin";
      if (searchValue.trim()) {
        query = `&searchType=${encodeURIComponent(searchType)}&searchValue=${encodeURIComponent(searchValue)}`;
      }

      const data = await getTests(query);
      setTests(data.tests);
    } catch (error: any) {
      console.error("Lỗi khi tải đề thi:", error);
      setError(error.response?.data?.error || "Failed to load tests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      fetchTests();
    }
  }, [role]);

  const sortedTests = useMemo(() => {
    let list = [...tests];

    if (showHiddenOnly) {
      list = list.filter(t => t.IsHidden === true);
    }

    if (sortByRecent) {
      return list.sort((a, b) => new Date(b.NgayTao).getTime() - new Date(a.NgayTao).getTime());
    }
    return list;
  }, [tests, sortByRecent, showHiddenOnly]);

  const totalPages = Math.ceil(sortedTests.length / itemsPerPage);

  const pagedTests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedTests.slice(start, start + itemsPerPage);
  }, [sortedTests, currentPage]);


  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleToggleHidden = async (IDDeThi: string) => {
    try {
      await toggleTestVisibility(IDDeThi);
      setTests(prev => prev.map(t =>
        t.IDDeThi === IDDeThi ? { ...t, IsHidden: !t.IsHidden } : t
      ));
    } catch (e) {
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  return (
    <section className="test-page-section">

      <TotalCount
        title="Manage Tests"
        statsLabel="Total Tests"
        statsValue={sortedTests.length}
        icon={<FileText size={20} />}
      />

      <SearchBar
        searchType={searchType}
        setSearchType={setSearchType}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={fetchTests}
        sortByRecent={sortByRecent}
        toggleSort={() => setSortByRecent(!sortByRecent)}
      />

      <div className="flex justify-end mb-6 px-4">
        <button
          onClick={() => setShowHiddenOnly(!showHiddenOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all shadow-sm border ${showHiddenOnly
              ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700" 
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
        >
          {showHiddenOnly ? <EyeOff size={18} /> : <Filter size={18} />}
          <span>{showHiddenOnly ? "Showing Hidden Only" : "Show Hidden Only"}</span>
        </button>
      </div>

      {loading && (
        <p className="test-page-message animate-pulse-text">Loading tests...</p>
      )}

      {error && (
        <p className="test-page-message error">{error}</p>
      )}

      {!loading && sortedTests.length === 0 && !error && (
        <div className="test-page-message">
          <p>No tests available matching your search.</p>
        </div>
      )}

      <div className="test-grid">
        {pagedTests.map((test) => (
          <div key={test.IDDeThi} className="test-grid-item relative group">
            <div className={test.IsHidden ? "opacity-50 grayscale" : ""}>
              <TestItem
                IDDeThi={test.IDDeThi}
                TenDeThi={test.TenDeThi}
                LoaiDeThi={test.LoaiDeThi}
                EncodeAnh={test.EncodeAnh}
                MieuTa={test.MieuTa}
                SoCauHoi={test.SoCauHoi}
                NgayTao={test.NgayTao}
                customHref={`/manage-tests/${test.IDDeThi}`}
              />
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleToggleHidden(test.IDDeThi);
              }}
              className={`absolute top-2 right-2 z-20 p-2 rounded-full shadow-md transition-all ${test.IsHidden
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-white text-gray-600 hover:text-blue-600"
                }`}
              title={test.IsHidden ? "Show Test" : "Hide Test"}
            >
              {test.IsHidden ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

            {test.IsHidden && (
              <span className="absolute top-2 left-2 z-20 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                HIDDEN
              </span>
            )}

          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

    </section>
  );
}