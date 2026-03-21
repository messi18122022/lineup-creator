import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">You're now Pro!</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Welcome to Lineup Creator Pro. All features are now unlocked.
        </p>
        <Link
          href="/"
          className="inline-block bg-green-600 hover:bg-green-500 text-white font-semibold
            rounded-lg px-6 py-2.5 text-sm transition-colors"
        >
          Back to app
        </Link>
      </div>
    </div>
  );
}
