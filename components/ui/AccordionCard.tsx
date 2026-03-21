"use client";

import { useState, useRef, useEffect, createContext, useContext } from "react";

const AccordionContext = createContext<() => void>(() => {});
export const useAccordionClose = () => useContext(AccordionContext);

interface AccordionCardProps {
  label: string;
  selectedLabel: string;
  children: React.ReactNode;
}

export default function AccordionCard({ label, selectedLabel, children }: AccordionCardProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children, open]);

  return (
    <AccordionContext.Provider value={() => setOpen(false)}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
        {/* Header — always visible */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800 transition-colors"
        >
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400">
              {label}
            </span>
            <span className="text-sm font-semibold text-zinc-100">{selectedLabel}</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-zinc-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Expandable content */}
        <div
          style={{ maxHeight: open ? height : 0 }}
          className="transition-[max-height] duration-300 ease-in-out overflow-hidden"
        >
          <div ref={contentRef} className="px-4 pb-4 pt-4 flex flex-col gap-2">
            {children}
          </div>
        </div>
      </div>
    </AccordionContext.Provider>
  );
}
