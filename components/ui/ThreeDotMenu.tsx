"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface MenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export default function ThreeDotMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function close() { setOpen(false); }
    document.addEventListener("mousedown", close);
    document.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("scroll", close, true);
    };
  }, [open]);

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow >= 120 ? rect.bottom + 4 : rect.top - 4 - Math.min(items.length * 32, 120);
      setPos({ top, right: window.innerWidth - rect.right });
    }
    setOpen(v => !v);
  }

  return (
    <div className="relative flex-shrink-0">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="w-6 h-5 flex items-center justify-center text-zinc-500 hover:text-zinc-200 transition-colors rounded text-base leading-none"
        title="Options"
      >
        ···
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div
          style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 9999 }}
          className="bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 min-w-[110px]"
          onMouseDown={e => e.stopPropagation()}
        >
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
        </div>,
        document.body
      )}
    </div>
  );
}
