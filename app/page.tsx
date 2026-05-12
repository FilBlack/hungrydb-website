import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-bg text-ink">
      <Nav />
      <Hero />
      <Features />
      <Contact />
      <Footer />
    </main>
  );
}
