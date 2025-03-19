import { FestivalPoster } from "@/components/festival-poster";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Your Festival Poster</h1>
      <FestivalPoster />
    </main>
  );
}
