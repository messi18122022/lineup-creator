import AuthForm from "./AuthForm";

interface AuthPageProps {
  searchParams: Promise<{ mode?: string }>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const { mode } = await searchParams;
  const initialMode = mode === "register" ? "register" : "login";

  const title = initialMode === "login" ? "Sign In" : "Create Account";

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl p-8 flex flex-col gap-6">
        <h1 className="text-sm font-bold uppercase tracking-widest text-center">
          <span className="text-green-500">Lineup</span>
          <span className="text-zinc-200"> Creator</span>
        </h1>
        <p className="text-base font-semibold text-zinc-100 text-center -mb-2">
          {title}
        </p>
        <AuthForm initialMode={initialMode} />
        <a
          href="/"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors text-center"
        >
          ← Back to app
        </a>
      </div>
    </div>
  );
}
