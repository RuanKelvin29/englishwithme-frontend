import React from 'react';

interface ThumbnailProps {
  onStartClick: () => void;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ onStartClick }) => {
  return (
    <section className="thumbnail-section">
      <div className="bg-grid-pattern"></div>
      
      <div className="thumbnail-container">
        <div className="thumbnail-badge">
          <span className="badge-dot"></span>
          <span>Your path to TOEIC success</span>
        </div>

        <h1 className="thumbnail-title">
          Learning English <br />
          made <span className="highlight-text">Simple & Effective</span>
        </h1>

        <p className="thumbnail-desc">
          Improve your vocabulary, grammar, and listening skills while preparing
          for your next TOEIC test. Anytime, anywhere, completely free.
        </p>

        <div className="thumbnail-actions">
          <button onClick={onStartClick} className="btn-start">
            Start Learning Now
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>

        <p className="thumbnail-note">
          Trusted by <strong>100+</strong> students.
        </p>
      </div>
    </section>
  );
};

export default Thumbnail;