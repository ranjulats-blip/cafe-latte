import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Shield, ShieldOff } from "lucide-react";

type Profile = { id: string; email: string | null; full_name: string | null; created_at: string };

export function AdminUsers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [admins, setAdmins] = useState<Set<string>>(new Set());

  const load = async () => {
    const { data: p } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: r } = await supabase.from("user_roles").select("user_id,role").eq("role", "admin");
    setProfiles((p || []) as Profile[]);
    setAdmins(new Set((r || []).map((x: any) => x.user_id)));
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id: string, makeAdmin: boolean) => {
    if (makeAdmin) {
      const { error } = await supabase.from("user_roles").insert({ user_id: id, role: "admin" });
      if (error) return toast.error(error.message);
      toast.success("Granted admin");
    } else {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", id).eq("role", "admin");
      if (error) return toast.error(error.message);
      toast.success("Revoked admin");
    }
    load();
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-card text-cream/60 text-xs uppercase tracking-wider">
          <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3 hidden md:table-cell">Joined</th><th className="text-left p-3">Role</th><th></th></tr>
        </thead>
        <tbody>
          {profiles.map(p => {
            const isAdmin = admins.has(p.id);
            return (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">{p.full_name || "—"}</td>
                <td className="p-3 text-cream/70">{p.email}</td>
                <td className="p-3 hidden md:table-cell text-cream/50">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`text-xs uppercase tracking-wider px-2 py-0.5 rounded-full ${isAdmin ? "bg-primary/20 text-primary" : "bg-cream/5 text-cream/50"}`}>
                    {isAdmin ? "Admin" : "User"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => toggle(p.id, !isAdmin)}>
                    {isAdmin ? <><ShieldOff className="w-4 h-4 mr-1" /> Revoke</> : <><Shield className="w-4 h-4 mr-1" /> Make admin</>}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
