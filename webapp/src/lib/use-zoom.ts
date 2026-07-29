import { useCallback, useEffect, useState } from "react";

const ZOOM_LEVELS = [0.8, 1.0, 1.25, 1.5, 2.0, 3.0];

export function useZoom() {
  const [zoomIdx, setZoomIdx] = useState(() => {
    try {
      const saved = localStorage.getItem("tauri-zoom");
      return saved ? ZOOM_LEVELS.indexOf(parseFloat(saved)) : 0;
    } catch {
      return 0;
    }
  });

  const applyZoom = useCallback(async (level: number) => {
    localStorage.setItem("tauri-zoom", String(level));
    try {
      const mod = await import("@tauri-apps/api/window");
      const win = mod.getCurrentWindow();
      if (win && typeof (win as any).setZoom === "function") {
        await (win as any).setZoom(level);
        return;
      }
    } catch {
      /* dev browser */
    }
    const el = document.getElementsByTagName("html")[0];
    if (el) (el.style as any).zoom = String(level);
  }, []);

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 : -1;
      const next = Math.max(0, Math.min(zoomIdx + delta, ZOOM_LEVELS.length - 1));
      if (next !== zoomIdx) {
        setZoomIdx(next);
        applyZoom(ZOOM_LEVELS[next]);
      }
    };
    window.addEventListener("wheel", handler, { passive: false });
    const saved = localStorage.getItem("tauri-zoom");
    if (saved) applyZoom(parseFloat(saved));
    return () => window.removeEventListener("wheel", handler);
  }, [zoomIdx, applyZoom]);
}
