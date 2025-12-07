"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSubmissions } from "../../api/apiSubmission";
import { deleteSubmission } from "@/api/apiSubmission";
import { FileText } from "lucide-react";
import SubItem from "../components/SubScreen/SubItem";
import SearchBar from "../components/Layout/SearchBar";
import Pagination from "../components/Layout/Pagination";
import TotalCount from "../components/Layout/TotalCount";

export default function MySubmissionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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
    const getUser = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        alert("You need to log in first!");
        router.push("/");
      }
    };
    getUser();
  }, [router]);

  const fetchSubs = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = "";
      if (searchValue.trim()) {
        query = `?searchType=${encodeURIComponent(searchType)}&searchValue=${encodeURIComponent(searchValue)}`;
      }

      const data = await getSubmissions(query);
      setSubs(data.submissions);
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.error || "Lỗi khi lấy danh sách bài thi";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchSubs();
  }, [user]);

  const handleDelete = async (IDBaiThi: string) => {
    if (!confirm("Bạn có chắc muốn xóa bài thi này?")) return;

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

  return (
    <section className="submissions-page-section">

      <TotalCount
        title="My Submissions"
        statsLabel="Total Subs"
        statsValue={subs.length}
        icon={<FileText size={20} />}
      />

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
        <p className="submission-status-msg empty">You haven't taken any tests yet. Go do some tests!</p>
      )}

      <div className="submissions-grid">
        {pagedSubs.map((s) => (
          <div key={s.IDBaiThi} className="submission-item-wrapper">
            <SubItem
              submission={s}
              handleDelete={handleDelete}
              loadingDelete={loadingDelete}
              source={`/my-submissions/${s.IDBaiThi}`}
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