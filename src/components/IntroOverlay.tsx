import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "cafe-latte-intro-seen";

export function IntroOverlay() {
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setShow(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    if (!show) return;
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => finish());
  }, [show]);

  const finish = () => {
    setFading(true);
    setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 800);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex items-center justify-center transition-opacity duration-700 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
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
