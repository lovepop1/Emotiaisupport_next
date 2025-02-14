"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface RisingStarsProps {
  size?: number
  width?: number
  height?: number
  colors?: string[]
}

const RisingStars: React.FC<RisingStarsProps> = ({
  size = 1024,
  width = 3840,
  height = 3840,
  colors = ["#FFF", "#FFD700", "#00FFFF", "#FF69B4"], // White, Gold, Cyan, Hot Pink
}) => {
  const [stars, setStars] = useState<string[]>([])

  useEffect(() => {
    const random = (max: number) => Math.floor(Math.random() * max)

    const generateStars = (count: number) => {
      return Array.from({ length: count }, () => {
        const x = random(width)
        const y = random(height)
        const color = colors[random(colors.length)]
        return `${x}px ${y}px ${color}`
      }).join(", ")
    }

    setStars([
      generateStars(size), // Small stars
      generateStars(size / 2), // Medium stars
      generateStars(size / 4), // Large stars
    ])
  }, [size, width, height, colors])

  return (
    <div className="rising-stars absolute inset-0 overflow-hidden w-full h-full">
      <div
        className="stars small animate-risingstar"
        style={{
          boxShadow: stars[0],
          animation: "risingstar 100s linear infinite",
        }}
      />
      <div
        className="stars medium animate-risingstar"
        style={{
          boxShadow: stars[1],
          animation: "risingstar 150s linear infinite",
        }}
      />
      <div
        className="stars large animate-risingstar"
        style={{
          boxShadow: stars[2],
          animation: "risingstar 200s linear infinite",
        }}
      />
      <style jsx>{`
        .stars {
          position: absolute;
          width: 2px;
          height: 2px;
          background: transparent;
        }
        .stars.medium {
          width: 3px;
          height: 3px;
        }
        .stars.large {
          width: 4px;
          height: 4px;
        }
      `}</style>
    </div>
  )
}

export default RisingStars

