import { useEffect, useState } from "react";

export function Hero({ content }: { content: any }) {
  const [vibe, setVibe] = useState("🔥 A Little Busy");
  useEffect(() => {
    const vibes = ["🔥 A Little Busy", "✨ Mellow Right Now", "🌙 Late-Night Hum", "☕ Cozy & Calm"];
    const i = setInterval(() => setVibe(vibes[Math.floor(Math.random()*vibes.length)]), 5000);
    return () => clearInterval(i);
  }, []);

  const c = content || {};

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-radial-warm">
      {/* Floating orbs */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl top-[20%] -left-[10%] animate-orb-float pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl top-[60%] -right-[5%] animate-orb-float [animation-delay:-3s] pointer-events-none" />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-amber/10 blur-3xl top-[40%] left-[40%] animate-orb-float [animation-delay:-5s] pointer-events-none" />

      {/* 3D rotating cup */}
      <div className="hidden lg:block absolute right-[6%] top-[20%] w-[300px] h-[300px] [perspective:600px] z-10 pointer-events-none">
        <div className="w-full h-full [transform-style:preserve-3d] animate-rotate-cup">
          {[
            { e: "☕", t: "translateZ(60px)" },
            { e: "🫖", t: "rotateY(180deg) translateZ(60px)" },
            { e: "✨", t: "rotateY(90deg) translateZ(60px)" },
            { e: "🌙", t: "rotateY(-90deg) translateZ(60px)" },
          ].map((f, i) => (
            <div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full flex items-center justify-center text-6xl border border-primary/20 shadow-[0_0_40px_hsl(var(--latte)/0.15)]"
              style={{ background: "radial-gradient(circle, hsl(var(--latte)/0.2), hsl(var(--espresso)/0.8))", transform: f.t }}>
              {f.e}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-20 px-6 md:px-12 max-w-4xl">
        <div className="section-eyebrow mb-6 animate-fade-up delay-300">{c.eyebrow || "Behala Chowrasta · Est. 2019"}</div>
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-black leading-[0.95] animate-fade-up delay-500">
          {c.title_line_1 || "Find Your"}<br />
          <span className="text-primary italic">{c.title_accent_1 || "Corner."}</span><br />
          {c.title_line_2 || "Sip Your"}<br />
          <span className="text-primary italic">{c.title_accent_2 || "Story."}</span>
        </h1>
        <p className="mt-7 mb-10 text-base md:text-xl text-cream/65 font-light leading-relaxed max-w-xl animate-fade-up delay-700">
          {c.tagline || "Where every seat has a secret, every sip has a memory."}
        </p>
        <div className="flex flex-wrap gap-3 animate-fade-up [animation-delay:0.9s]">
          <a href="#menu" className="gradient-gold text-espresso px-8 py-3 rounded-full font-semibold uppercase tracking-[0.1em] text-xs shadow-[var(--shadow-glow)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow-lg)] transition-all">
            🍽️ Explore Menu
          </a>
          <a href="#order" className="bg-transparent text-cream px-8 py-3 rounded-full font-medium uppercase tracking-[0.1em] text-xs border border-cream/30 hover:border-primary hover:text-primary transition-all">
            🛵 Order Online
          </a>
          <a href="#reserve" className="bg-transparent text-cream px-8 py-3 rounded-full font-medium uppercase tracking-[0.1em] text-xs border border-cream/30 hover:border-primary hover:text-primary transition-all">
            📅 Reserve Table
          </a>
        </div>
      </div>

      {/* Vibe badge */}
      <div className="hidden md:block absolute right-12 bottom-[28%] z-20 glass rounded-2xl px-6 py-5 animate-float">
        <div className="text-xs uppercase tracking-[0.15em] text-primary flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-blink" />
          Live Vibe
        </div>
        <div className="text-lg font-semibold mt-1">{vibe}</div>
        <div className="text-xs text-cream/50 mt-1">~15 min wait · Open till 1 AM 🌙</div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent animate-scroll-pulse" />
      </div>
    </section>
  );
}
