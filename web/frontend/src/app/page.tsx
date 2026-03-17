"use client";

import { SmoothScroll } from "@/components/landing/smooth-scroll";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer";
import { AppDownload } from "@/components/landing/app-download";
import { Services } from "@/components/landing/services";

export default function LandingPage() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-zinc-950">
        <Navbar />
        <Hero />
        <AppDownload />
        <Services />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
