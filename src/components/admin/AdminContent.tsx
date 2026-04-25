import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const KEYS = [
  { key: "hero", title: "Hero section", fields: ["eyebrow", "title_line_1", "title_accent_1", "title_line_2", "title_accent_2", "tagline"] },
  { key: "about", title: "About", fields: ["title", "body"] },
  { key: "info", title: "Visit info", fields: ["address", "hours", "phone"] },
];

export function AdminContent() {
  const [data, setData] = useState<Record<string, any>>({});

  const load = async () => {
    const { data: rows } = await supabase.from("site_content").select("*");
    const map: Record<string, any> = {};
    (rows || []).forEach((r: any) => { map[r.key] = r.value; });
    setData(map);
  };
  useEffect(() => { load(); }, []);

  const save = async (key: string) => {
    const { error } = await supabase.from("site_content").upsert({ key, value: data[key] || {} });
    if (error) return toast.error(error.message);
    toast.success("Saved");
  };

  const set = (key: string, field: string, value: string) => {
    setData(d => ({ ...d, [key]: { ...(d[key] || {}), [field]: value } }));
  };

  return (
    <div className="space-y-6">
      {KEYS.map(group => (
        <div key={group.key} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-bold">{group.title}</h3>
            <Button size="sm" onClick={() => save(group.key)} className="gradient-gold text-espresso">Save</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {group.fields.map(f => (
              <div key={f} className={f === "tagline" || f === "body" ? "md:col-span-2" : ""}>
                <Label className="text-xs uppercase tracking-wider text-cream/60">{f.replace(/_/g, " ")}</Label>
                {f === "tagline" || f === "body" ? (
                  <Textarea value={data[group.key]?.[f] || ""} onChange={e => set(group.key, f, e.target.value)} rows={3} className="mt-1.5" />
                ) : (
                  <Input value={data[group.key]?.[f] || ""} onChange={e => set(group.key, f, e.target.value)} className="mt-1.5" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
