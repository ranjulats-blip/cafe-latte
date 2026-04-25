import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Section = { id: string; slug: string; name: string; icon: string | null; sort_order: number; is_visible: boolean };

export function AdminSections() {
  const [rows, setRows] = useState<Section[]>([]);
  const [draft, setDraft] = useState({ slug: "", name: "", icon: "🍽️", sort_order: 0 });

  const load = async () => {
    const { data } = await supabase.from("menu_sections").select("*").order("sort_order");
    setRows((data || []) as Section[]);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.slug || !draft.name) return toast.error("Slug & name required");
    const { error } = await supabase.from("menu_sections").insert({
      slug: draft.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      name: draft.name, icon: draft.icon, sort_order: Number(draft.sort_order) || rows.length + 1,
    });
    if (error) return toast.error(error.message);
    setDraft({ slug: "", name: "", icon: "🍽️", sort_order: 0 });
    load();
  };

  const update = async (id: string, patch: Partial<Section>) => {
    await supabase.from("menu_sections").update(patch).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete section and all its items?")) return;
    await supabase.from("menu_sections").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5">
        <div className="text-xs uppercase tracking-wider text-primary mb-3">Add new section</div>
        <div className="grid md:grid-cols-5 gap-3">
          <div><Label className="text-xs">Slug</Label><Input value={draft.slug} onChange={e => setDraft({...draft, slug: e.target.value})} placeholder="desserts" /></div>
          <div><Label className="text-xs">Name</Label><Input value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} placeholder="Desserts" /></div>
          <div><Label className="text-xs">Icon</Label><Input value={draft.icon} onChange={e => setDraft({...draft, icon: e.target.value})} maxLength={4} /></div>
          <div><Label className="text-xs">Order</Label><Input type="number" value={draft.sort_order} onChange={e => setDraft({...draft, sort_order: Number(e.target.value)})} /></div>
          <div className="flex items-end"><Button onClick={add} className="w-full gradient-gold text-espresso"><Plus className="w-4 h-4 mr-1" /> Add</Button></div>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-card text-cream/60 text-xs uppercase tracking-wider">
            <tr><th className="text-left p-3">Icon</th><th className="text-left p-3">Name</th><th className="text-left p-3">Slug</th><th className="text-left p-3">Order</th><th className="text-left p-3">Visible</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map(s => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-3"><Input className="w-16" value={s.icon || ""} onChange={e => update(s.id, { icon: e.target.value })} /></td>
                <td className="p-3"><Input value={s.name} onChange={e => update(s.id, { name: e.target.value })} /></td>
                <td className="p-3 text-cream/60">{s.slug}</td>
                <td className="p-3"><Input type="number" className="w-20" value={s.sort_order} onChange={e => update(s.id, { sort_order: Number(e.target.value) })} /></td>
                <td className="p-3"><Switch checked={s.is_visible} onCheckedChange={v => update(s.id, { is_visible: v })} /></td>
                <td className="p-3 text-right"><Button size="icon" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
