import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — HeyBaby AI" }] }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-2xl mx-auto px-5 pt-10 pb-32">
        <h1 className="text-4xl font-extrabold">About HeyBaby AI</h1>
        <p className="text-ink/70 mt-4 text-lg leading-relaxed">
          We built HeyBaby because choosing a baby name shouldn't feel like a spreadsheet. It should feel like
          falling in love — together.
        </p>
        <p className="text-ink/70 mt-4 leading-relaxed">
          Our deck of <b>8,000+ carefully curated names from around the world</b> — Sanskrit, Tamil, Telugu, Hindi, Arabic, Persian, English, French, Japanese, and more —
          comes with AI Vibe Scores, numerology, Vedic astrology, and personality archetypes. Swipe with your partner in
          real time, and the moment you both fall for the same name, we'll celebrate with you.
        </p>
        <p className="text-ink/70 mt-4 leading-relaxed">
          Built with ♥ by Indian parents, for Indian & NRI families everywhere.
        </p>
      </div>
      <BottomNav />
    </div>
  );
}
