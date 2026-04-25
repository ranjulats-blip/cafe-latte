import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Free, hosted café ambience loop (lo-fi jazz). Users can toggle on/off.
const AMBIENT_URL = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3";

export function AmbientSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = new Audio(AMBIENT_URL);
    a.loop = true;
    a.volume = 0.25;
    audioRef.current = a;
    return () => { a.pause(); audioRef.current = null; };
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { try { await a.play(); setPlaying(true); } catch {} }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Mute café ambience" : "Play café ambience"}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full glass border-primary/30 flex items-center justify-center text-primary hover:scale-110 transition-transform shadow-[var(--shadow-glow)]"
    >
      {playing ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </button>
  );
}
