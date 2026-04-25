import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Shield } from "lucide-react";

const links = [
  { label: "Menu", href: "#menu" },
  { label: "Order", href: "#order" },
  { label: "Reserve", href: "#reserve" },
  { label: "Visit", href: "#info" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all px-6 md:px-12 py-4 flex items-center justify-between ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-gradient-to-b from-background/90 to-transparent"}`}>
      <Link to="/" className="font-display text-2xl font-black tracking-wide">
        Café <span className="text-primary">Latté</span>
      </Link>

      <ul className="hidden md:flex gap-10 list-none">
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href} className="text-xs uppercase tracking-[0.12em] text-cream/70 hover:text-cream transition-colors relative group">
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        {isAdmin && (
          <Button variant="ghost" size="sm" onClick={() => nav("/admin")} className="text-primary hidden sm:inline-flex">
            <Shield className="w-4 h-4 mr-1" /> Admin
          </Button>
        )}
        {user ? (
          <>
            <Button variant="ghost" size="sm" onClick={() => nav("/account")}>
              <UserIcon className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Account</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Button onClick={() => nav("/auth")} className="rounded-full font-medium tracking-wider uppercase text-xs">
            Sign in
          </Button>
        )}
      </div>
    </nav>
  );
}
