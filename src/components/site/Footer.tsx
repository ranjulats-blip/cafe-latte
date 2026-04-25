export function Footer() {
  return (
    <footer className="bg-[hsl(24_75%_2%)] px-6 md:px-12 py-16 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-8">
        <div>
          <div className="font-display text-3xl font-black">Café <span className="text-primary">Latté</span></div>
          <div className="text-xs text-cream/35 uppercase tracking-[0.15em] mt-1">Find Your Corner. Sip Your Story.</div>
        </div>
        <div className="font-display italic text-primary">#FoundMyCorner</div>
      </div>
      <div className="border-t border-cream/5 mt-10 pt-6 text-center text-xs text-cream/20 tracking-[0.1em]">
        © {new Date().getFullYear()} Café Latté · Behala Chowrasta
      </div>
    </footer>
  );
}
