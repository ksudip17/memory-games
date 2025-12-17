"use client"

import { COLORS } from "@/utils/colorGameLogic"

interface ColorPadProps {
  colorIndex: number
  isActive: boolean
  isDisabled: boolean
  onClick: () => void
}

export default function ColorPad({ colorIndex, isActive, isDisabled, onClick }: ColorPadProps) {
  const color = COLORS[colorIndex]

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        aspect-square rounded-2xl transition-all duration-300 
        ${color.bg} 
        ${isActive ? color.active : ""}
        ${!isDisabled ? `hover:scale-105 shadow-lg hover:shadow-xl ${color.glow}` : "opacity-60 cursor-not-allowed"}
        ${isActive ? `shadow-2xl ${color.glow}` : ""}
      `}
      aria-label={`${color.name} pad`}
    />
  )
}
