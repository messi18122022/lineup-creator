export default function FieldLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 68 105"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outline */}
      <rect x="1" y="1" width="66" height="103" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
      {/* Halfway line */}
      <line x1="1" y1="52.5" x2="67" y2="52.5" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
      {/* Center circle */}
      <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
      <circle cx="34" cy="52.5" r="0.5" fill="rgba(255,255,255,0.55)" />
      {/* Penalty area top */}
      <rect x="13.84" y="1" width="40.32" height="16.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
      {/* Goal area top */}
      <rect x="24.84" y="1" width="18.32" height="5.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
      {/* Penalty arc top */}
      <path d="M 24.84 17.5 A 9.15 9.15 0 0 0 43.16 17.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
      {/* Penalty spot top */}
      <circle cx="34" cy="11" r="0.5" fill="rgba(255,255,255,0.55)" />
      {/* Penalty area bottom */}
      <rect x="13.84" y="87.5" width="40.32" height="16.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
      {/* Goal area bottom */}
      <rect x="24.84" y="98.5" width="18.32" height="5.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
      {/* Penalty arc bottom */}
      <path d="M 24.84 87.5 A 9.15 9.15 0 0 1 43.16 87.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
      {/* Penalty spot bottom */}
      <circle cx="34" cy="94" r="0.5" fill="rgba(255,255,255,0.55)" />
      {/* Corner arcs */}
      <path d="M 1 3.5 A 2.5 2.5 0 0 0 3.5 1" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
      <path d="M 64.5 1 A 2.5 2.5 0 0 0 67 3.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
      <path d="M 1 101.5 A 2.5 2.5 0 0 1 3.5 104" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
      <path d="M 64.5 104 A 2.5 2.5 0 0 1 67 101.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" />
    </svg>
  );
}
