"use client";

import React from "react";

interface AccountSearchBarProps {
  searchType: "IDTaiKhoan" | "Email";
  setSearchType: (value: "IDTaiKhoan" | "Email") => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  onSearch: () => void;
  sortByRecent: boolean;
  toggleSort: () => void;
}

const AccountSearchBar: React.FC<AccountSearchBarProps> = ({
  searchType,
  setSearchType,
  searchValue,
  setSearchValue,
  onSearch,
  sortByRecent,
  toggleSort,
}) => {
  return (
    <div className="search-bar-container">
      <div className="relative">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as "IDTaiKhoan" | "Email")}
          className="search-select"
        >
          <option value="IDTaiKhoan">Search by Username</option>
          <option value="Email">Search by Email</option>
        </select>
      </div>

      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={
          searchType === "IDTaiKhoan"
            ? "Enter username..."
            : "Enter email address..."
        }
        className="search-input"
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />

      <button
        onClick={onSearch}
        className="search-btn btn-search-action"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search
      </button>

      <button
        onClick={toggleSort}
        className="search-btn btn-sort-action"
      >
        {sortByRecent ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Sort
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Recently Sort
          </>
        )}
      </button>
    </div>
  );
};

export default AccountSearchBar;