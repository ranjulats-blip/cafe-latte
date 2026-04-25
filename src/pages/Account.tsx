import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type Order = { id: string; order_type: string; status: string; details: any; created_at: string; total: number };

export default function Account() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => { document.title = "My account · Café Latté"; }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data || []) as Order[]));
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-cream/50">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-radial-warm pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="font-display text-2xl font-black">Café <span className="text-primary">Latté</span></Link>
          <div className="flex gap-2">
            {isAdmin && <Button asChild variant="outline"><Link to="/admin">Admin panel</Link></Button>}
            <Button variant="ghost" onClick={signOut}>Sign out</Button>
          </div>
        </div>

        <div className="section-eyebrow">Your account</div>
        <h1 className="font-display text-5xl font-black mt-3 mb-1">
          Hey, <em className="text-primary">{profile?.full_name || user.email?.split("@")[0]}</em>
        </h1>
        <p className="text-cream/45 mb-10">{user.email}</p>

        <h2 className="font-display text-2xl font-bold mb-4">Your reservations & orders</h2>
        <div className="space-y-3">
          {orders.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center text-cream/40">
              Nothing yet. <Link to="/#reserve" className="text-primary hover:underline">Book a table</Link>?
            </div>
          )}
          {orders.map(o => (
            <div key={o.id} className="glass rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.15em] text-primary">{o.order_type}</div>
                <div className="font-medium mt-0.5">
                  {o.details?.date} · {o.details?.time} · party of {o.details?.party}
                </div>
                <div className="text-xs text-cream/40 mt-0.5">
                  {new Date(o.created_at).toLocaleDateString()}
                </div>
              </div>
              <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full ${
                o.status === "confirmed" ? "bg-green-500/15 text-green-400" :
                o.status === "cancelled" ? "bg-destructive/15 text-destructive" :
                "bg-amber/15 text-amber"
              }`}>{o.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
