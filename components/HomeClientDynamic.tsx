"use client";

import dynamic from "next/dynamic";

const HomeClient = dynamic(() => import("@/components/HomeClient"), {
  ssr: false,
  loading: () => <div className="h-screen bg-zinc-950" />,
});

interface Props {
  userEmail: string | null;
  isPro: boolean;
}

export default function HomeClientDynamic({ userEmail, isPro }: Props) {
  return <HomeClient userEmail={userEmail} isPro={isPro} />;
}
