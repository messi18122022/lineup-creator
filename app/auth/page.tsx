export default function AuthPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl p-8 flex flex-col gap-6 text-center">
        <h1 className="text-lg font-bold uppercase tracking-widest text-zinc-200">
          Lineup Creator
        </h1>
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-green-500">
            Coming Soon
          </span>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Pro features are on their way.
          </p>
          <p className="text-zinc-500 text-xs">
            Sign-up will be available once Pro launches.
          </p>
        </div>
        <a
          href="/"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← Back to app
        </a>
      </div>
    </div>
  );
}

