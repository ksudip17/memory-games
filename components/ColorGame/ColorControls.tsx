"use client"

import { Button } from "@/components/ui/button"

interface ColorControlsProps {
  gameStatus: "idle" | "playing" | "gameover"
  onStart: () => void
  onRestart: () => void
}

export default function ColorControls({ gameStatus, onStart, onRestart }: ColorControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      {gameStatus === "idle" && (
        <Button
          onClick={onStart}
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 rounded-xl shadow-lg"
        >
          Start Color Game
        </Button>
      )}

      {gameStatus === "gameover" && (
        <Button
          onClick={onRestart}
          size="lg"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6 rounded-xl shadow-lg"
        >
          Play Again
        </Button>
      )}
    </div>
  )
}
