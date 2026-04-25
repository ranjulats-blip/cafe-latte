import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Order = {
  id: string; customer_name: string; customer_email: string | null; customer_phone: string | null;
  order_type: string; details: any; status: string; created_at: string;
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export function AdminOrders() {
  const [rows, setRows] = useState<Order[]>([]);
  const load = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setRows((data || []) as Order[]);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    load();
  };

  return (
    <div className="space-y-3">
      {rows.length === 0 && <div className="glass rounded-2xl p-8 text-center text-cream/40">No orders yet.</div>}
      {rows.map(o => (
        <div key={o.id} className="glass rounded-2xl p-5 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="text-xs uppercase tracking-wider text-primary">{o.order_type}</div>
            <div className="font-medium mt-0.5">{o.customer_name}</div>
            <div className="text-xs text-cream/50 mt-0.5">
              {o.customer_phone} {o.customer_email && `· ${o.customer_email}`}
            </div>
            <div className="text-xs text-cream/60 mt-1">
              {o.details?.date} · {o.details?.time} · party of {o.details?.party}
            </div>
          </div>
          <div className="text-xs text-cream/40">{new Date(o.created_at).toLocaleString()}</div>
          <Select value={o.status} onValueChange={v => updateStatus(o.id, v)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
