import React from 'react';

export default function WalkingStep({ step, index, isLast }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-6 h-6 rounded-full bg-accent border-[3px] border-base text-[10px] flex items-center justify-center font-bold text-white relative z-10 shrink-0 shadow-sm mt-0.5">
        {index + 1}
      </div>
      <div className={`mt-1 text-sm leading-snug ${isLast ? 'text-primary font-medium' : 'text-muted'}`}>
        {step}
      </div>
    </div>
  );
}
