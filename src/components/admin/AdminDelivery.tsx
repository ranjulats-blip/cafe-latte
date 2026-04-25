import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Link = { id: string; platform: string; url: string; is_active: boolean };

export function AdminDelivery() {
  const [rows, setRows] = useState<Link[]>([]);
  const [draft, setDraft] = useState({ platform: "", url: "" });

  const load = async () => {
    const { data } = await supabase.from("delivery_links").select("*").order("platform");
    setRows((data || []) as Link[]);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.platform || !draft.url) return toast.error("Both fields required");
    const { error } = await supabase.from("delivery_links").insert({
      platform: draft.platform.toLowerCase(), url: draft.url, is_active: true,
    });
    if (error) return toast.error(error.message);
    setDraft({ platform: "", url: "" }); load();
  };

  const update = async (id: string, patch: Partial<Link>) => {
    await supabase.from("delivery_links").update(patch).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this link?")) return;
    await supabase.from("delivery_links").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5">
        <div className="text-xs uppercase tracking-wider text-primary mb-3">Add platform</div>
        <div className="grid md:grid-cols-3 gap-3">
          <div><Label className="text-xs">Platform (swiggy / zomato / etc.)</Label><Input value={draft.platform} onChange={e => setDraft({...draft, platform: e.target.value})} /></div>
          <div><Label className="text-xs">URL</Label><Input value={draft.url} onChange={e => setDraft({...draft, url: e.target.value})} placeholder="https://…" /></div>
          <div className="flex items-end"><Button onClick={add} className="w-full gradient-gold text-espresso"><Plus className="w-4 h-4 mr-1" /> Add</Button></div>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map(r => (
          <div key={r.id} className="glass rounded-2xl p-4 flex items-center gap-4 flex-wrap">
            <div className="w-24 font-display capitalize">{r.platform}</div>
            <Input value={r.url} onChange={e => update(r.id, { url: e.target.value })} className="flex-1 min-w-[200px]" />
            <div className="flex items-center gap-2">
              <Switch checked={r.is_active} onCheckedChange={v => update(r.id, { is_active: v })} />
              <span className="text-xs text-cream/60">Live</span>
            </div>
            <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
