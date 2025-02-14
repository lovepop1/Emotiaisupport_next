"use client"

import type React from "react"
import { useRef, useEffect } from "react"

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  hue?: number
  size?: number
  border?: number
  radius?: number
}

export function GlowCard({ children, className = "", hue = 120, size = 200, border = 2, radius = 10 }: GlowCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const syncPointer = (e: PointerEvent) => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      wrapperRef.current.style.setProperty("--x", x.toFixed(2))
      wrapperRef.current.style.setProperty("--xp", (x / rect.width).toFixed(2))
      wrapperRef.current.style.setProperty("--y", y.toFixed(2))
      wrapperRef.current.style.setProperty("--yp", (y / rect.height).toFixed(2))
    }
  }

  const leaveWrapper = () => {
    if (wrapperRef.current) {
      wrapperRef.current.style.setProperty("--x", "0")
      wrapperRef.current.style.setProperty("--y", "0")
    }
  }

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (wrapper) {
      wrapper.addEventListener("pointermove", syncPointer)
      wrapper.addEventListener("pointerleave", leaveWrapper)
      wrapper.style.setProperty("--hue", hue.toString())
      wrapper.style.setProperty("--size", size.toString())
      wrapper.style.setProperty("--border", border.toString())
      wrapper.style.setProperty("--radius", radius.toString())
    }

    return () => {
      if (wrapper) {
        wrapper.removeEventListener("pointermove", syncPointer)
        wrapper.removeEventListener("pointerleave", leaveWrapper)
      }
    }
  }, [hue, size, border, radius, leaveWrapper])

  return (
    <div className={`sui-glow-card-wrapper ${className}`} ref={wrapperRef}>
      <section className="sui-glow-card" data-glow>
        <div data-glow></div>
        {children}
      </section>
      <style jsx>{`
        .sui-glow-card-wrapper {
          --backdrop: hsl(0 0% 60% / 0.12);
          --radius: ${radius};
          --border: ${border};
          --backup-border: var(--backdrop);
          --size: ${size};
          --hue: ${hue};
        }
        .sui-glow-card:first-of-type {
          --base: 80;
          --spread: 500;
          --outer: 1;
        }
        .sui-glow-card:last-of-type {
          --outer: 1;
          --base: 220;
          --spread: 200;
        }
        .sui-glow-card {
          position: relative;
          border-radius: calc(var(--radius) * 1px);
          box-shadow: 0 1rem 2rem -1rem black;
          backdrop-filter: blur(calc(var(--cardblur, 5) * 1px));
        }
        [data-glow] {
          --border-size: calc(var(--border, 2) * 1px);
          --spotlight-size: calc(var(--size, 150) * 1px);
          background-image: radial-gradient(
            var(--spotlight-size) var(--spotlight-size) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
            hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)),
            transparent
          );
          background-color: var(--backdrop, transparent);
          background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
          background-position: 50% 50%;
          background-attachment: fixed;
          border: var(--border-size) solid var(--backup-border);
          position: relative;
          touch-action: none;
        }
        [data-glow]::before,
        [data-glow]::after {
          pointer-events: none;
          content: '';
          position: absolute;
          inset: calc(var(--border-size) * -1);
          border: var(--border-size) solid transparent;
          border-radius: calc(var(--radius) * 1px);
          background-attachment: fixed;
          background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
          background-repeat: no-repeat;
          background-position: 50% 50%;
          mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
          mask-clip: padding-box, border-box;
          mask-composite: intersect;
        }
        [data-glow]::before {
          background-image: radial-gradient(
            calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
            hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)),
            transparent 100%
          );
          filter: brightness(2);
        }
        [data-glow]::after {
          background-image: radial-gradient(
            calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
            hsl(0 100% 100% / var(--border-light-opacity, 1)),
            transparent 100%
          );
        }
        [data-glow] [data-glow] {
          position: absolute;
          inset: 0;
          will-change: filter;
          opacity: var(--outer, 1);
        }
        [data-glow] > [data-glow] {
          border-radius: calc(var(--radius) * 1px);
          border-width: calc(var(--border-size) * 20);
          filter: blur(calc(var(--border-size) * 10));
          background: none;
          pointer-events: none;
        }
        [data-glow] > [data-glow]::before {
          inset: -10px;
          border-width: 10px;
        }
        [data-glow] [data-glow] {
          border: none;
        }
        [data-glow] :is(a, button) {
          border-radius: calc(var(--radius) * 1px);
          border: var(--border-size) solid transparent;
        }
        [data-glow] :is(a, button) [data-glow] {
          background: none;
        }
        [data-glow] :is(a, button) [data-glow]::before {
          inset: calc(var(--border-size) * -1);
          border-width: calc(var(--border-size) * 1);
        }
      `}</style>
    </div>
  )
}

