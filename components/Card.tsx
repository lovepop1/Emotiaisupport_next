import React from "react";

interface CardProps {
  className?: string;
  hue: number;
  size: number;
  border: number;
  radius: number;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, hue, size, border, radius, children }) => {
  return (
    <div
      className={`bg-white shadow-lg rounded-lg ${className}`}
      style={{
        borderColor: `hsl(${hue}, 100%, 50%)`,
        borderWidth: border,
        borderRadius: radius,
        width: size,
        height: size,
      }}
    >
      {children}
    </div>
  );
};
