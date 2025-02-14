"use client"

import type React from "react"
import { motion } from "framer-motion"

interface GlowingButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  color?: string
}

export function GlowingButton({ children, onClick, className = "", color = "#22c55e" }: GlowingButtonProps) {
  return (
    <motion.button
      className={`group relative z-[1] bg-transparent text-neutral-100 hover:text-neutral-100 hover:no-underline ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="absolute -left-[1.5px] -top-[1.5px] z-[-1] h-[calc(100%+2.5px)] w-[calc(100%+2.5px)] overflow-hidden rounded-lg">
        <div
          className="animate-spin [animation-duration:5s] absolute left-[-12.5%] top-[-40px] aspect-square h-auto w-[125%]"
          style={{
            backgroundImage: `conic-gradient(from 90deg at 50% 50%, ${color}54 0, ${color}54 10%, ${color} 20%, ${color}54 30%, ${color}54 60%, ${color} 70%, ${color}54 80%, ${color}54 100%)`,
          }}
        ></div>
      </div>
      <div className="rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-800 px-4 py-2">
        <div className="flex items-center justify-center gap-2 transition-transform duration-100 ease-in-out group-hover:scale-105">
          {children}
        </div>
      </div>
    </motion.button>
  )
}

