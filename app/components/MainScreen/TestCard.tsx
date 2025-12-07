import React from 'react';
import Link from 'next/link';

interface TestCardProps {
  title: string;
  description: string;
  path: string;
}

const TestCard: React.FC<TestCardProps> = ({ title, description, path }) => {
  return (
    <div className="test-card">
      <div className="test-card-icon-wrapper">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </div>

      <h3 className="test-card-title">{title}</h3>
      <p className="test-card-desc">{description}</p>

      <Link href={path} className="test-card-btn-link">
        <button className="test-card-btn">
          Let's go!
          <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </Link>
    </div>
  );
};

export default TestCard;