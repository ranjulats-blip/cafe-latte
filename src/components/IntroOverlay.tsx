import { useEffect, useRef, useState } from "react";

interface IntroOverlayProps {
  onReveal?: () => void;
}

export function IntroOverlay({ onReveal }: IntroOverlayProps) {
  const [show, setShow] = useState(true);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => finish());
  }, []);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFading(true);
    // Trigger site fade-in immediately so they crossfade
    onReveal?.();
    setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 2500);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex items-center justify-center transition-opacity ease-in-out ${
        fading ? "opacity-0 duration-[2500ms]" : "opacity-100 duration-300"
      }`}
      style={{ pointerEvents: fading ? "none" : "auto" }}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        muted
        playsInline
        autoPlay
        onEnded={finish}
        className="w-full h-full object-cover"
      />
      <button
        onClick={finish}
        className="absolute bottom-8 right-8 text-cream/70 hover:text-primary text-xs uppercase tracking-[0.3em] transition-colors"
        aria-label="Skip intro"
      >
        Skip →
      </button>
    </div>
  );
}
