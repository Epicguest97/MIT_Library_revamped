import { LinkFinder } from "@/components/LinkFinder";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto mb-6 p-3 bg-neutral-800 text-white rounded text-sm text-center">
        MIT has finally taken steps to significantly improve its library portal ...a lot better actually, so I’ve decided to deprecate my own site. I’m really glad to see the official platform getting the attention it needed. <a href="https://mitmpllibportal.manipal.edu/question-papers">view here</a>
      </div>
      <LinkFinder />
      <Analytics />
    </main>
  );
}
