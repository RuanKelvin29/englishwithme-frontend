"use client";

import { useState, useEffect, useMemo } from "react";
import { getTests } from "../../api/apiTest";
import { FileText } from "lucide-react";
import TestItem, { Test } from "../components/TestScreen/TestItem";
import SearchBar from "../components/Layout/SearchBar";
import Pagination from "../components/Layout/Pagination";
import TotalCount from "../components/Layout/TotalCount";

export default function TestPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [searchType, setSearchType] = useState<"TenDeThi" | "LoaiDeThi">("TenDeThi");
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortByRecent, setSortByRecent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = "";
      if (searchValue.trim()) {
        query = `?searchType=${encodeURIComponent(searchType)}&searchValue=${encodeURIComponent(searchValue)}`;
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
    fetchTests();
  }, []);

  const sortedTests = useMemo(() => {
    const list = [...tests];
    if (sortByRecent) {
      return list.sort((a, b) => new Date(b.NgayTao).getTime() - new Date(a.NgayTao).getTime());
    }
    return list;
  }, [tests, sortByRecent]);

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

  return (
    <section className="test-page-section">

      <TotalCount
        title="Available Tests"
        statsLabel="Total Tests"
        statsValue={tests.length}
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

      {loading && (
        <p className="test-page-message animate-pulse-text">Loading tests...</p>
      )}

      {error && (
        <p className="test-page-message error">{error}</p>
      )}

      {!loading && sortedTests.length === 0 && !error && (
        <div className="test-page-message">
          <p>No tests available matching your criteria.</p>
        </div>
      )}

      <div className="test-grid">
        {pagedTests.map((test) => (
          <div key={test.IDDeThi} className="test-grid-item">
            <TestItem
              IDDeThi={test.IDDeThi}
              TenDeThi={test.TenDeThi}
              LoaiDeThi={test.LoaiDeThi}
              EncodeAnh={test.EncodeAnh}
              MieuTa={test.MieuTa}
              SoCauHoi={test.SoCauHoi}
              NgayTao={test.NgayTao}
            />
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