import { MapPin, Clock, Phone } from "lucide-react";

export function InfoSection({ info }: { info: any }) {
  const i = info || {};
  return (
    <section id="info" className="px-6 md:px-12 py-28 bg-background">
      <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
        <div>
          <div className="section-eyebrow">Visit Us</div>
          <h2 className="font-display text-5xl md:text-6xl font-black mt-4 mb-8">
            Come <em className="text-primary">say hi.</em>
          </h2>

          <div className="space-y-6">
            <InfoBlock icon={<MapPin />} label="Address" value={i.address || "Behala Chowrasta, Kolkata"} />
            <InfoBlock icon={<Clock />} label="Hours" value={i.hours || "11:00 AM – 1:00 AM"} sub="Open every day" />
            <InfoBlock icon={<Phone />} label="Call" value={i.phone || "+91 00000 00000"} />
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-4">When We're Buzzing</div>
          <div className="space-y-2">
            {[
              { d: "Mon", v: 50 }, { d: "Tue", v: 55 }, { d: "Wed", v: 60 },
              { d: "Thu", v: 70 }, { d: "Fri", v: 90 }, { d: "Sat", v: 95 }, { d: "Sun", v: 85 },
            ].map(row => (
              <div key={row.d} className="flex items-center gap-3">
                <span className="text-xs w-10 uppercase text-cream/50">{row.d}</span>
                <div className="flex-1 h-2 rounded-full bg-cream/10 overflow-hidden">
                  <div className="h-full rounded-full gradient-gold transition-all" style={{ width: `${row.v}%` }} />
                </div>
                <span className="text-xs text-cream/40 w-8 text-right">{row.v}%</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-cream/40 mt-6 italic">Tip: weekday afternoons are the calmest.</p>
        </div>
      </div>
    </section>
  );
}

function InfoBlock({ icon, label, value, sub }: any) {
  return (
    <div>
      <div className="text-primary mb-2">{icon}</div>
      <div className="text-[0.7rem] uppercase tracking-[0.25em] text-primary mb-1">{label}</div>
      <div className="text-lg font-medium">{value}</div>
      {sub && <div className="text-sm text-cream/45 mt-0.5">{sub}</div>}
    </div>
  );
}
