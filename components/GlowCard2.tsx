"use client";

import type React from "react";
import { useRef, useEffect } from "react";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
  border?: number;
  radius?: number;
}

export function GlowCard({
  children,
  className = "",
  size = 250,
  border = 3, // Stronger border
  radius = 8, // Slightly rounded rectangle
}: GlowCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const syncPointer = (e: PointerEvent) => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      wrapperRef.current.style.setProperty("--x", `${x}px`);
      wrapperRef.current.style.setProperty("--y", `${y}px`);
    }
  };

  const leaveWrapper = () => {
    if (wrapperRef.current) {
      wrapperRef.current.style.setProperty("--x", "50%");
      wrapperRef.current.style.setProperty("--y", "50%");
    }
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener("pointermove", syncPointer);
      wrapper.addEventListener("pointerleave", leaveWrapper);
      wrapper.style.setProperty("--size", `${size}px`);
      wrapper.style.setProperty("--border", `${border}px`);
      wrapper.style.setProperty("--radius", `${radius}px`);
    }

    return () => {
      if (wrapper) {
        wrapper.removeEventListener("pointermove", syncPointer);
        wrapper.removeEventListener("pointerleave", leaveWrapper);
      }
    };
  }, [size, border, radius]);

  return (
    <div className={`glow-card-wrapper ${className}`} ref={wrapperRef}>
      <section className="glow-card" data-glow>
        <div data-glow></div>
        {children}
      </section>
      <style jsx>{`
        .glow-card-wrapper {
          --radius: ${radius}px;
          --border: ${border}px;
          --size: ${size}px;
          position: relative;
        }

        .glow-card {
          position: relative;
          border-radius: var(--radius);
          background-color: transparent; /* Fully transparent */
          border: var(--border) solid #86efac; /* Green-300 border */
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.6); /* Soft white glow */
          transition: box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out;
          padding: 20px;
          overflow: hidden;
        }

        [data-glow] {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(
            120px 120px at var(--x, 50%) var(--y, 50%),
            rgba(255, 255, 255, 0.4),
            transparent 80%
          );
          border-radius: var(--radius);
          pointer-events: none;
          z-index: -1;
        }

        .glow-card-wrapper:hover .glow-card {
          box-shadow: 0 0 30px rgba(255, 255, 255, 1);
          border-color: #4ade80; /* Slightly brighter green */
        }
      `}</style>
    </div>
  );
}
