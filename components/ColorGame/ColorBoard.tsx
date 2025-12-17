"use client"

import ColorPad from "./ColorPad"

interface ColorBoardProps {
  activeColor: number | null
  isDisabled: boolean
  onColorClick: (index: number) => void
}

export default function ColorBoard({ activeColor, isDisabled, onColorClick }: ColorBoardProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {[0, 1, 2, 3].map((index) => (
        <ColorPad
          key={index}
          colorIndex={index}
          isActive={activeColor === index}
          isDisabled={isDisabled}
          onClick={() => onColorClick(index)}
        />
      ))}
    </div>
  )
}
