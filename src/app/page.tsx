import { LinkFinder } from "@/components/LinkFinder";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8">
       <LinkFinder />
       <Analytics />
    </main>
  );
}
