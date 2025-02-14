"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  color?: string
  size?: number
}

export function SpotlightCard({
  children,
  className = "",
  color = "rgba(255, 255, 255, 0.1)",
  size = 300,
}: SpotlightCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        setPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const card = cardRef.current
    if (card) {
      card.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  return (
    <motion.div
      ref={cardRef}
      className={`rounded-3xl border border-neutral-950/10 dark:border-white/10 bg-white/[.012] p-2 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div
        className="spotlight-card relative overflow-hidden rounded-2xl border border-neutral-950/10 dark:border-white/10 bg-neutral-950/[.012] dark:bg-white/5 shadow-sm dark:shadow-md shadow-neutral-50/50 dark:shadow-neutral-950/50"
        style={
          {
            "--x": `${position.x}px`,
            "--y": `${position.y}px`,
            "--spotlight-color-stops": `${color}, transparent`,
            "--spotlight-size": `${size}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
      <style jsx>{`
        .spotlight-card:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.3s;
          background-image: radial-gradient(
            var(--spotlight-size) circle at var(--x) var(--y),
            var(--spotlight-color-stops)
          );
          pointer-events: none;
        }
        .spotlight-card:hover:before {
          opacity: 1;
        }
      `}</style>
    </motion.div>
  )
}

