"use client"

import { Button } from "@/components/ui/button"

type GameStatus = "idle" | "countdown" | "playing" | "waiting" | "gameover"

interface ControlPanelProps {
  gameStatus: GameStatus
  actions: string[]
  onAction: (action: string) => void
  onStart: () => void
  onRestart: () => void
  selectedAction: string | null
  isCorrect: boolean | null
}

export default function ControlPanel({
  gameStatus,
  actions,
  onAction,
  onStart,
  onRestart,
  selectedAction,
  isCorrect,
}: ControlPanelProps) {
  const isDisabled = gameStatus !== "waiting"

  const getButtonStyle = (action: string) => {
    if (selectedAction === action) {
      return isCorrect
        ? "bg-green-500 hover:bg-green-500 scale-105 text-white border-green-500"
        : "bg-red-500 hover:bg-red-500 animate-shake text-white border-red-500"
    }
    return ""
  }

  if (gameStatus === "idle") {
    return (
      <div className="text-center">
        <Button
          onClick={onStart}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Start Game
        </Button>
      </div>
    )
  }

  if (gameStatus === "gameover") {
    return (
      <div className="text-center">
        <Button
          onClick={onRestart}
          size="lg"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Play Again
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <Button
          key={action}
          onClick={() => onAction(action)}
          disabled={isDisabled}
          className={`h-20 text-lg font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 rounded-xl ${getButtonStyle(
            action,
          )}`}
        >
          <span className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">({index + 1})</span>
            {action}
          </span>
        </Button>
      ))}
    </div>
  )
}
