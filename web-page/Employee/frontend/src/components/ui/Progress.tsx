import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export function Progress({ value, max = 100, size = 'md', className, showLabel }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden', sizes[size], className)}>
        <div
          className="h-full bg-gradient-to-r from-teal-600 to-sky-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs text-slate-400 text-right">{Math.round(percentage)}%</p>
      )}
    </div>
  );
}
