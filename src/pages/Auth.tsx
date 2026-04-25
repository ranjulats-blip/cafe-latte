import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const emailSchema = z.string().trim().email().max(200);
const passSchema = z.string().min(6).max(100);

export default function Auth() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = mode === "sign-in" ? "Sign in · Café Latté" : "Create account · Café Latté";
  }, [mode]);

  useEffect(() => {
    if (!loading && user) nav("/", { replace: true });
  }, [user, loading, nav]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const fullName = String(fd.get("full_name") || "");

    const ev = emailSchema.safeParse(email);
    const pv = passSchema.safeParse(password);
    if (!ev.success) return toast.error("Invalid email");
    if (!pv.success) return toast.error("Password must be 6+ characters");

    setBusy(true);
    if (mode === "sign-up") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: fullName },
        },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Account created! Check your email to confirm.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Welcome back ☕");
      nav("/", { replace: true });
    }
  };

  const google = async () => {
    setBusy(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/`,
    });
    if (error) { setBusy(false); toast.error("Couldn't sign in with Google"); }
  };

  return (
    <div className="min-h-screen bg-radial-warm flex items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <Link to="/" className="font-display text-2xl font-black">
          Café <span className="text-primary">Latté</span>
        </Link>
      </div>

      <div className="w-full max-w-md glass rounded-3xl p-8 md:p-10">
        <div className="section-eyebrow">{mode === "sign-in" ? "Welcome back" : "Join us"}</div>
        <h1 className="font-display text-4xl font-black mt-3 mb-1">
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </h1>
        <p className="text-cream/45 text-sm mb-8">
          {mode === "sign-in" ? "Pick up where you left off." : "A corner of warmth, just for you."}
        </p>

        <Button onClick={google} disabled={busy} variant="outline"
          className="w-full rounded-full border-cream/15 hover:border-primary hover:text-primary py-6 mb-5">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.92h5.27c-.23 1.5-1.74 4.4-5.27 4.4-3.18 0-5.77-2.63-5.77-5.86s2.59-5.86 5.77-5.86c1.81 0 3.02.77 3.71 1.43l2.53-2.44C17.06 3.94 14.94 3 12.18 3 6.97 3 2.78 7.18 2.78 12.4s4.19 9.4 9.4 9.4c5.42 0 9.02-3.81 9.02-9.18 0-.62-.07-1.09-.16-1.52z"/></svg>
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-cream/10" />
          <span className="text-xs text-cream/40 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-cream/10" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "sign-up" && (
            <div>
              <Label className="text-xs uppercase tracking-[0.2em] text-primary">Name</Label>
              <Input name="full_name" required className="mt-2 bg-cream/5 border-cream/15" />
            </div>
          )}
          <div>
            <Label className="text-xs uppercase tracking-[0.2em] text-primary">Email</Label>
            <Input name="email" type="email" required className="mt-2 bg-cream/5 border-cream/15" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-[0.2em] text-primary">Password</Label>
            <Input name="password" type="password" required minLength={6} className="mt-2 bg-cream/5 border-cream/15" />
          </div>
          <Button type="submit" disabled={busy} className="w-full gradient-gold text-espresso font-semibold uppercase tracking-[0.1em] text-xs rounded-full py-6">
            {busy ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="text-center text-sm text-cream/45 mt-6">
          {mode === "sign-in" ? "New here?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")} className="text-primary hover:underline">
            {mode === "sign-in" ? "Create one" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
