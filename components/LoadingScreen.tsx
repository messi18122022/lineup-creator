"use client";

const LINEUP = "Lineup".split("");
const CREATOR = "Creator".split("");
const ALL_CHARS = [...LINEUP, " ", ...CREATOR];

export default function LoadingScreen() {
  return (
    <div className="h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex items-center select-none">
        {ALL_CHARS.map((char, i) => (
          char === " " ? (
            <span key={i} className="w-3" />
          ) : (
            <span
              key={i}
              className={`text-3xl font-bold tracking-tight ${i < LINEUP.length ? "text-green-500" : "text-zinc-200"}`}
              style={{
                display: "inline-block",
                animation: "lcWave 1.4s ease-in-out infinite",
                animationDelay: `${i * 0.07}s`,
              }}
            >
              {char}
            </span>
          )
        ))}
      </div>
      <style>{`
        @keyframes lcWave {
          0%, 60%, 100% { transform: translateY(0px); opacity: 1; }
          30% { transform: translateY(-10px); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
