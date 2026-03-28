import { createClient } from "@/lib/supabase/server";

const features = [
  {
    title: "Custom Modes & Formations",
    description:
      "Create your own game modes and define custom formations for each — beyond the built-in defaults.",
    available: true,
  },
  {
    title: "Team Management",
    description:
      "Save up to 2 teams with full player rosters. Plan lineups from your actual squad.",
    available: false,
  },
  {
    title: "Saved Lineups",
    description:
      "Save multiple lineup plans per team and come back to edit them anytime — all stored in your account.",
    available: false,
  },
  {
    title: "Field Customization",
    description:
      "Adjust the field to match your preferences — colors, markings, and layout.",
    available: false,
  },
  {
    title: "Multiple Sports",
    description:
      "Switch between sports: Football, Basketball, Ice Hockey, Volleyball, and more to come.",
    available: false,
  },
];

export default async function ProPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ctaHref = user ? "/api/checkout" : "/auth?mode=register";
  const ctaLabel = "Get Pro";

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-500">
            Lineup Creator
          </p>
          <h1 className="text-2xl font-bold text-zinc-100">Get Pro</h1>
          <p className="text-zinc-400 text-sm">
            Everything you need to plan like a pro.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-3"
            >
              {f.available ? (
                <span className="absolute top-2.5 right-3 text-[0.6rem] font-bold uppercase tracking-wider text-green-500">
                  Available
                </span>
              ) : (
                <span className="absolute top-2.5 right-3 text-[0.6rem] font-bold uppercase tracking-wider text-zinc-500">
                  Coming Soon
                </span>
              )}
              <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path
                    d="M1.5 4L3 5.5L6.5 2"
                    stroke="#22c55e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-zinc-100">
                  {f.title}
                </span>
                <span className="text-xs text-zinc-400 leading-relaxed">
                  {f.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-zinc-100">
              CHF 2
              <span className="text-base font-normal text-zinc-400"> / year</span>
            </span>
          </div>
          <a
            href={ctaHref}
            className="block w-full bg-green-600 hover:bg-green-500 transition-colors rounded-lg px-4 py-3 text-sm font-semibold text-white"
          >
            {ctaLabel}
          </a>
          <a
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back to app
          </a>
        </div>
      </div>
    </div>
  );
}
