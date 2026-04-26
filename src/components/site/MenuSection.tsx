import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Section = { id: string; slug: string; name: string; icon: string | null };
type Item = { id: string; section_id: string; name: string; description: string | null; price: number; emoji: string | null; tag: string | null; image_url: string | null };

export function MenuSection() {
  const [sections, setSections] = useState<Section[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: secs } = await supabase.from("menu_sections").select("*").eq("is_visible", true).order("sort_order");
      const { data: its } = await supabase.from("menu_items").select("*").eq("is_available", true).order("sort_order");
      setSections((secs || []) as Section[]);
      setItems((its || []) as Item[]);
      if (secs && secs.length) setActive(secs[0].id);
    })();
  }, []);

  const visible = items.filter(i => i.section_id === active);

  return (
    <section id="menu" className="px-6 md:px-12 py-28 bg-background">
      <div className="section-eyebrow">What's Cooking</div>
      <h2 className="font-display text-5xl md:text-7xl font-black mt-4">
        The <em className="text-primary">Menu</em>
      </h2>
      <p className="text-cream/45 mt-4 mb-8 max-w-xl">Indo-Chinese flavors, street-smart recipes, made with soul.</p>

      <div className="flex gap-3 flex-wrap mb-10">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.12em] font-medium border transition-all ${
              active === s.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-cream/50 border-cream/15 hover:border-primary hover:text-primary"
            }`}
          >
            {s.icon} {s.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visible.map(item => (
          <div key={item.id} className="relative overflow-hidden glass rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-card)] group flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden bg-cream/5">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">{item.emoji || "🍽️"}</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-transparent pointer-events-none" />
              {item.tag && (
                <span className="absolute top-3 right-3 text-[0.65rem] px-2.5 py-1 rounded-full bg-amber/90 text-background uppercase tracking-[0.1em] font-semibold backdrop-blur-sm">
                  {item.tag}
                </span>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-display text-lg font-bold text-cream mb-1.5 flex items-center gap-2">
                <span>{item.emoji}</span>{item.name}
              </h3>
              <p className="text-sm text-cream/45 leading-relaxed mb-4 flex-1">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-numeric text-2xl text-primary tracking-wide">₹{Number(item.price).toFixed(0)}</span>
              </div>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="col-span-full text-center text-cream/40 py-12">No items in this section yet.</div>
        )}
      </div>
    </section>
  );
}
