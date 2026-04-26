import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { MenuSection } from "@/components/site/MenuSection";
import { OrderSection } from "@/components/site/OrderSection";
import { ReserveSection } from "@/components/site/ReserveSection";
import { InfoSection } from "@/components/site/InfoSection";
import { Footer } from "@/components/site/Footer";
import { AmbientSound } from "@/components/AmbientSound";
import { IntroOverlay } from "@/components/IntroOverlay";

const Index = () => {
  const [content, setContent] = useState<Record<string, any>>({});
  const [siteVisible, setSiteVisible] = useState(false);

  useEffect(() => {
    document.title = "Café Latté — Find Your Corner. Sip Your Story.";
    supabase.from("site_content").select("*").then(({ data }) => {
      const map: Record<string, any> = {};
      (data || []).forEach((r: any) => { map[r.key] = r.value; });
      setContent(map);
    });

    // Reveal-on-scroll
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting && e.target.classList.add("visible"));
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div
        className={`transition-opacity ease-in-out duration-[2500ms] ${
          siteVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Navbar />
        <main>
          <Hero content={content.hero} />
          <MenuSection />
          <OrderSection />
          <ReserveSection />
          <InfoSection info={content.info} />
        </main>
        <Footer />
        <AmbientSound />
      </div>
      <IntroOverlay onReveal={() => setSiteVisible(true)} />
    </div>
  );
};

export default Index;
