import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  customer_email: z.string().trim().email().max(200).optional().or(z.literal("")),
  customer_phone: z.string().trim().min(6).max(20),
  date: z.string().min(1),
  time: z.string().min(1),
  party: z.string().min(1),
});

const SLOTS = ["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"];

export function ReserveSection() {
  const { user } = useAuth();
  const [time, setTime] = useState(SLOTS[2]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      customer_name: fd.get("customer_name"),
      customer_email: fd.get("customer_email"),
      customer_phone: fd.get("customer_phone"),
      date: fd.get("date"),
      time,
      party: fd.get("party"),
    });
    if (!parsed.success) {
      toast.error("Please check your details");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("orders").insert({
      user_id: user?.id ?? null,
      customer_name: parsed.data.customer_name,
      customer_email: parsed.data.customer_email || null,
      customer_phone: parsed.data.customer_phone,
      order_type: "reservation",
      details: { date: parsed.data.date, time: parsed.data.time, party: parsed.data.party },
    });
    setLoading(false);
    if (error) { toast.error("Couldn't save reservation"); return; }
    toast.success("Reservation requested! We'll confirm shortly.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="reserve" className="px-6 md:px-12 py-28 bg-background">
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
        <div>
          <div className="section-eyebrow">Reserve</div>
          <h2 className="font-display text-5xl md:text-7xl font-black mt-4 mb-4">
            Save your <em className="text-primary">corner.</em>
          </h2>
          <p className="text-cream/50 leading-relaxed max-w-md">
            Tables fill up fast on weekends. Drop your details and we'll hold a spot just for you.
          </p>
        </div>

        <form onSubmit={onSubmit} className="glass rounded-3xl p-8 space-y-5">
          <div>
            <Label className="text-xs uppercase tracking-[0.2em] text-primary">Name</Label>
            <Input name="customer_name" required className="mt-2 bg-cream/5 border-cream/15" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase tracking-[0.2em] text-primary">Phone</Label>
              <Input name="customer_phone" required className="mt-2 bg-cream/5 border-cream/15" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-[0.2em] text-primary">Email</Label>
              <Input name="customer_email" type="email" className="mt-2 bg-cream/5 border-cream/15" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase tracking-[0.2em] text-primary">Date</Label>
              <Input name="date" type="date" required className="mt-2 bg-cream/5 border-cream/15" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-[0.2em] text-primary">Party</Label>
              <Input name="party" type="number" min="1" max="20" defaultValue="2" required className="mt-2 bg-cream/5 border-cream/15" />
            </div>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-[0.2em] text-primary">Time</Label>
            <div className="flex gap-2 flex-wrap mt-2">
              {SLOTS.map(s => (
                <button key={s} type="button" onClick={() => setTime(s)}
                  className={`px-3.5 py-1.5 rounded-full text-xs border transition-all ${
                    time === s ? "bg-primary text-primary-foreground border-primary" : "border-cream/15 text-cream/60 hover:border-primary hover:text-primary"
                  }`}>{s}</button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-gold text-espresso font-semibold uppercase tracking-[0.1em] text-xs hover:opacity-90 rounded-full py-6">
            {loading ? "Saving…" : "Reserve table"}
          </Button>
        </form>
      </div>
    </section>
  );
}
