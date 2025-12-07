"use client";
import React from "react";

interface TotalCountProps {
  title: string;
  statsLabel: string;
  statsValue: number | string;
  icon: React.ReactNode;
}

export default function TotalCount({ 
  title, 
  statsLabel, 
  statsValue, 
  icon 
}: TotalCountProps) {
  return (
    <div className="page-header-wrapper">
      <h1 className="page-title-main">{title}</h1>

      <div className="submission-stats-card">
        <div className="stats-icon-wrapper">
          {icon}
        </div>
        <div>
          <p className="stats-label">{statsLabel}</p>
          <p className="stats-value">{statsValue}</p>
        </div>
      </div>
    </div>
  );
}