"use client";
import { useState, useEffect, useRef } from "react";

interface MenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export default function ThreeDotMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setOpenUp(window.innerHeight - rect.bottom < 120);
    }
    setOpen(v => !v);
  }

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="w-6 h-5 flex items-center justify-center text-zinc-500 hover:text-zinc-200 transition-colors rounded text-base leading-none"
        title="Options"
      >
        ···
      </button>
      {open && (
        <div className={`absolute right-0 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 py-1 min-w-[110px] ${openUp ? "bottom-full mb-1" : "top-full mt-1"}`}>
          {items.map(item => (
            <button
              key={item.label}
              onClick={(e) => { e.stopPropagation(); item.onClick(); setOpen(false); }}
              className={`w-full px-3 py-1.5 text-left text-xs font-medium transition-colors hover:bg-zinc-700 ${
                item.danger ? "text-red-400 hover:text-red-300" : "text-zinc-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
