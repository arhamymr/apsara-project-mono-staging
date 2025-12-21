"use client";

import { useEffect, useCallback, useRef } from "react";

export function GlobalRipple() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  const createRipple = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const ripple = document.createElement("span");
    rippleIdRef.current++;
    const size = 15;
    const x = e.clientX - size / 2;
    const y = e.clientY - size / 2;

    ripple.className = "global-ripple";
    ripple.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      background: radial-gradient(circle, rgba(0, 201, 80, 0.6) 0%, rgba(0, 201, 80, 0.3) 40%, transparent 70%);
      animation: clickRipple 400ms ease-out forwards;
    `;

    container.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 400);
  }, []);

  useEffect(() => {
    // Inject keyframes if not already present
    const styleId = "global-ripple-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes clickRipple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(3.5);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.addEventListener("mousedown", createRipple);
    return () => document.removeEventListener("mousedown", createRipple);
  }, [createRipple]);

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-[99999]" />
  );
}
