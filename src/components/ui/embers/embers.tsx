'use client';

import React, { useMemo } from 'react';

type EmbersProps = {
  count?: number;
  color?: string; // CSS color
  className?: string;
};

export const Embers: React.FC<EmbersProps> = ({
  count = 26,
  color = 'rgba(255, 160, 64, 0.9)',
  className,
}) => {
  // Generate particle specs once
  const particles = useMemo(() => {
    const arr = Array.from({ length: count }).map((_, i) => {
      const size = Math.round(3 + Math.random() * 4); // 3-6px
      const left = Math.random() * 100; // vw%
      const delay = Math.random() * 6; // s
      const duration = 6 + Math.random() * 8; // 6-14s
      const opacity = 0.3 + Math.random() * 0.5;
      const blur = Math.random() < 0.5 ? 0 : 1 + Math.random() * 2;
      return { id: i, size, left, delay, duration, opacity, blur };
    });
    return arr;
  }, [count]);

  return (
    <div className={className} aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="ember-particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
            background: color,
            filter: p.blur ? `blur(${p.blur}px)` : undefined,
          }}
        />
      ))}
    </div>
  );
};

export default Embers;
