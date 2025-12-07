"use client";
import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PaginationProps) {
  
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="pagination-btn"
        title="First Page"
      >
        <ChevronsLeft size={20} />
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
        title="Previous Page"
      >
        <ChevronLeft size={20} />
      </button>

      <span className="pagination-info">
        Page {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
        title="Next Page"
      >
        <ChevronRight size={20} />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
        title="Last Page"
      >
        <ChevronsRight size={20} />
      </button>
    </div>
  );
}