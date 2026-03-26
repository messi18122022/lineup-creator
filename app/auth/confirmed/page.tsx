interface ConfirmedPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function ConfirmedPage({ searchParams }: ConfirmedPageProps) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl p-8 flex flex-col gap-6 text-center">
        <div className="flex justify-center">
          <span className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M4 11L9 16L18 6"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-base font-semibold text-zinc-100">Email confirmed</h1>
          {email ? (
            <p className="text-sm text-zinc-400">
              You can now sign in with{" "}
              <span className="text-zinc-200 font-medium">{email}</span>
            </p>
          ) : (
            <p className="text-sm text-zinc-400">You can now sign in to your account.</p>
          )}
        </div>

        <a
          href="/auth?mode=login"
          className="block w-full bg-green-600 hover:bg-green-500 transition-colors rounded-lg px-4 py-3 text-sm font-semibold text-white"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
