import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

type Section = { id: string; name: string };
type Item = { id: string; section_id: string; name: string; description: string | null; price: number; emoji: string | null; tag: string | null; sort_order: number; is_available: boolean };

const empty: Partial<Item> = { name: "", description: "", price: 0, emoji: "🍽️", tag: "", sort_order: 0, is_available: true };

export function AdminMenu() {
  const [sections, setSections] = useState<Section[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data: secs } = await supabase.from("menu_sections").select("id,name").order("sort_order");
    const { data: its } = await supabase.from("menu_items").select("*").order("section_id").order("sort_order");
    setSections((secs || []) as Section[]);
    setItems((its || []) as Item[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.name || !editing?.section_id) return toast.error("Name and section required");
    const payload = {
      section_id: editing.section_id!,
      name: editing.name!,
      description: editing.description || null,
      price: Number(editing.price) || 0,
      emoji: editing.emoji || null,
      tag: editing.tag || null,
      sort_order: Number(editing.sort_order) || 0,
      is_available: editing.is_available ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("menu_items").update(payload).eq("id", editing.id)
      : await supabase.from("menu_items").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setOpen(false); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  const filtered = sectionFilter === "all" ? items : items.filter(i => i.section_id === sectionFilter);
  const sectionName = (id: string) => sections.find(s => s.id === id)?.name || "—";

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Label className="text-xs uppercase tracking-wider text-cream/60">Section</Label>
          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sections</SelectItem>
              {sections.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ ...empty, section_id: sections[0]?.id })} className="gradient-gold text-espresso">
              <Plus className="w-4 h-4 mr-1" /> Add item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing?.id ? "Edit item" : "New item"}</DialogTitle></DialogHeader>
            {editing && <ItemForm value={editing} onChange={setEditing} sections={sections} onSave={save} />}
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-card text-cream/60 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left p-3">Item</th>
              <th className="text-left p-3 hidden md:table-cell">Section</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3 hidden md:table-cell">Tag</th>
              <th className="text-left p-3">On</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(it => (
              <tr key={it.id} className="border-t border-border">
                <td className="p-3"><span className="mr-2">{it.emoji}</span>{it.name}</td>
                <td className="p-3 hidden md:table-cell text-cream/60">{sectionName(it.section_id)}</td>
                <td className="p-3 font-numeric text-primary">₹{Number(it.price).toFixed(0)}</td>
                <td className="p-3 hidden md:table-cell text-cream/60">{it.tag}</td>
                <td className="p-3">
                  <Switch checked={it.is_available} onCheckedChange={async v => {
                    await supabase.from("menu_items").update({ is_available: v }).eq("id", it.id);
                    load();
                  }} />
                </td>
                <td className="p-3 text-right">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(it); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(it.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ItemForm({ value, onChange, sections, onSave }: any) {
  const v = value as Partial<Item>;
  const set = (k: keyof Item, val: any) => onChange({ ...v, [k]: val });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Section</Label>
          <Select value={v.section_id} onValueChange={x => set("section_id", x)}>
            <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
            <SelectContent>
              {sections.map((s: Section) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Emoji</Label>
          <Input value={v.emoji || ""} onChange={e => set("emoji", e.target.value)} maxLength={4} />
        </div>
      </div>
      <div>
        <Label>Name</Label>
        <Input value={v.name || ""} onChange={e => set("name", e.target.value)} />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={v.description || ""} onChange={e => set("description", e.target.value)} rows={2} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Price (₹)</Label>
          <Input type="number" value={v.price ?? 0} onChange={e => set("price", e.target.value)} />
        </div>
        <div>
          <Label>Tag</Label>
          <Input value={v.tag || ""} onChange={e => set("tag", e.target.value)} placeholder="🔥 Crowd Fave" />
        </div>
        <div>
          <Label>Order</Label>
          <Input type="number" value={v.sort_order ?? 0} onChange={e => set("sort_order", e.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={v.is_available ?? true} onCheckedChange={x => set("is_available", x)} />
        <Label className="cursor-pointer">Available</Label>
      </div>
      <Button onClick={onSave} className="w-full gradient-gold text-espresso">Save</Button>
    </div>
  );
}
