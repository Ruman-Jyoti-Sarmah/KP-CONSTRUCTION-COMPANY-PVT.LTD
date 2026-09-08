import { useEffect, useRef } from "react";

/**
 * Elegant custom cursor: a champagne dot with a soft trailing ring,
 * plus an optional contextual label for interactive elements
 * (`data-cursor-label="View"`). Desktop + fine-pointer, non-haptic only.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const prefers =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine =
      window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefers) return undefined;

    const doc = document.documentElement;
    doc.classList.add("custom-cursor-active");

    let raf = 0;
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;

    const render = () => {
      raf = 0;
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onOver = (e) => {
      const t = e.target.closest ? e.target.closest("a, button, [data-cursor-label]") : null;
      doc.classList.toggle("cursor-hover", !!t);
      const lbl = t && t.dataset ? t.dataset.cursorLabel : null;
      if (labelRef.current) {
        if (lbl) {
          labelRef.current.textContent = lbl;
          labelRef.current.classList.add("on");
        } else {
          labelRef.current.classList.remove("on");
        }
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      doc.classList.remove("custom-cursor-active");
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-label" ref={labelRef} aria-hidden="true" />
    </>
  );
}