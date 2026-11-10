import { LinkFinder } from "@/components/LinkFinder";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto mb-6 p-3 bg-neutral-800 text-white rounded text-sm text-center">
        Links updated as of 10 Nov 2026. The official question paper source is <a href="https://libportal.manipal.edu/MIT/Question%20paper.aspx">the library portal</a>, which opens only on desktop and iBus. First-year students can also check these backup sites: <a href="https://mitvault.vercel.app/">MIT Vault</a> and <a href="https://pyqclutch.vercel.app/">PYQ Clutch</a>.
      </div>
      <LinkFinder />
      <Analytics />
    </main>
  );
}
