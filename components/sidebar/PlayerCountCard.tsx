"use client";

interface PlayerCountCardProps {
  count: number;
  onChange: (count: number) => void;
}

export default function PlayerCountCard({ count, onChange }: PlayerCountCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
        Players
      </p>
      <p className="text-4xl font-bold text-sky-400 text-center mb-3">{count}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(Math.max(1, count - 1))}
          className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg
            text-white text-xl font-bold py-1.5 transition-colors"
        >
          −
        </button>
        <button
          onClick={() => onChange(Math.min(11, count + 1))}
          className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg
            text-white text-xl font-bold py-1.5 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
