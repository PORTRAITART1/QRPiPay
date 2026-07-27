import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  count?: number;
  circle?: boolean;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  count = 1,
  circle = false
}: SkeletonProps) {
  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${circle ? 'skeleton-circle' : ''}`}
          style={{
            width: circle ? height : width,
            height: height,
            marginBottom: i < count - 1 ? '0.5rem' : '0'
          }}
        />
      ))}
    </div>
  );
}

export default Skeleton;
