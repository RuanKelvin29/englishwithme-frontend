"use client";

import { useRef } from 'react';
import Thumbnail from './components/MainScreen/Thumbnail';
import TestCard from './components/MainScreen/TestCard';

const lessons = [
  { title: 'Vocabulary & Grammar', description: 'Start learning English from basic to advanced.', path: '/vocabulary'},
  { title: 'Listening', description: 'Practice for Listening skill.', path: '/listening'},
  { title: 'Ready for the real tests?', description: 'Practice with real test.', path:'/test'},
];

export default function HomePage() {
  const testCardsRef = useRef<HTMLDivElement>(null);

  const scrollToTestCards = () => {
    testCardsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="home-wrapper">
      <Thumbnail onStartClick={scrollToTestCards} />
      
      <div ref={testCardsRef} className="courses-section">
        <div className="courses-container">
          
          <div className="section-header">
            <h2 className="section-title">Choose Your Learning Path</h2>
            <p className="section-subtitle">Select a skill you want to improve or take a full test</p>
          </div>

          <div className="cards-grid">
            {lessons.map((lesson, index) => (
              <TestCard 
                key={index} 
                title={lesson.title} 
                description={lesson.description}
                path={lesson.path}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}