import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight } from "lucide-react";

type Link = { id: string; platform: string; url: string };

const PLATFORM_META: Record<string, { name: string; icon: string; sub: string }> = {
  swiggy: { name: "Swiggy", icon: "🛵", sub: "Fast delivery, hot & fresh" },
  zomato: { name: "Zomato", icon: "🍅", sub: "Order in or dine out" },
};

export function OrderSection() {
  const [links, setLinks] = useState<Link[]>([]);
  useEffect(() => {
    supabase.from("delivery_links").select("*").eq("is_active", true)
      .then(({ data }) => setLinks((data || []) as Link[]));
  }, []);

  return (
    <section id="order" className="px-6 md:px-12 py-28 bg-gradient-to-b from-background via-card to-background">
      <div className="max-w-5xl mx-auto">
        <div className="section-eyebrow">Order Online</div>
        <h2 className="font-display text-5xl md:text-7xl font-black mt-4 mb-3">
          Crave it. <em className="text-primary">Get it.</em>
        </h2>
        <p className="text-cream/45 mb-10 max-w-xl">Order from your favourite delivery app — straight to your door.</p>

        <div className="grid sm:grid-cols-2 gap-5">
          {links.map(l => {
            const meta = PLATFORM_META[l.platform] || { name: l.platform, icon: "🍽️", sub: "" };
            return (
              <a key={l.id} href={l.url} target="_blank" rel="noreferrer"
                className="group flex items-center gap-5 glass rounded-2xl p-6 hover:border-primary hover:bg-primary/5 hover:translate-x-1 transition-all">
                <div className="text-4xl">{meta.icon}</div>
                <div className="flex-1">
                  <div className="font-display text-xl font-bold">{meta.name}</div>
                  <div className="text-xs text-cream/45 mt-0.5">{meta.sub}</div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            );
          })}
          {links.length === 0 && (
            <div className="col-span-2 text-center text-cream/40 py-12">Delivery links coming soon.</div>
          )}
        </div>
      </div>
    </section>
  );
}
