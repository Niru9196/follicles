'use client';
import React, { useEffect, useState } from 'react';

interface ChapterNavProps {
  currentChapter: number;
  totalChapters: number;
}

const chapters = [
  { num: 'I', label: 'BEGINNING' },
  { num: 'II', label: 'PATTERN' },
  { num: 'III', label: 'TIMELINE' },
  { num: 'IV', label: 'INFLUENCES' },
  { num: 'V', label: 'TREATMENTS' },
  { num: 'VI', label: 'HABITS' },
  { num: 'VII', label: 'STORY' },
];

export default function ChapterNav({ currentChapter }: ChapterNavProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const progressWidth = Math.min(100, ((Math.max(0, currentChapter + 1) / Math.max(1, chapters.length)) * 100));

  return (
    <>
      <nav
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 items-start"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        {chapters.map((ch, i) => {
          const isActive = i === currentChapter;
          return (
            <div key={i} className="flex items-center gap-3 group cursor-default">
              <div
                className="transition-all duration-500"
                style={{
                  width: isActive ? '24px' : '8px',
                  height: '2px',
                  backgroundColor: isActive ? '#C9A84C' : 'rgba(201,168,76,0.3)',
                  borderRadius: '1px',
                }}
              />
              <span
                className="text-xs tracking-widest transition-all duration-500"
                style={{
                  color: isActive ? '#C9A84C' : 'rgba(201,168,76,0.3)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '10px',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateX(0)' : 'translateX(-4px)',
                }}
              >
                {ch.num} {ch.label}
              </span>
            </div>
          );
        })}
      </nav>

      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden h-0.5 bg-transparent">
        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${progressWidth}%`,
            background: 'linear-gradient(90deg, #C9A84C, #D4B96A)',
          }}
        />
      </div>
    </>
  );
}
