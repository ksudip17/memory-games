"use client"

type GameStatus = "idle" | "playing" | "gameover"

interface SignalControlsProps {
  gameStatus: GameStatus
  onStart: () => void
  onRestart: () => void
}

export default function SignalControls({ gameStatus, onStart, onRestart }: SignalControlsProps) {
  if (gameStatus === "idle" || gameStatus === "gameover") {
    return (
      <div className="flex justify-center">
        <button
          onClick={gameStatus === "idle" ? onStart : onRestart}
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-base sm:text-lg md:text-xl py-3 px-6 sm:py-3 sm:px-8 md:py-4 md:px-12 rounded-xl hover:scale-105 transition-transform shadow-lg w-full sm:w-auto"
        >
          {gameStatus === "idle" ? "Start Game" : "Play Again"}
        </button>
      </div>
    )
  }

  return (
    <div className="text-center text-slate-600 text-xs sm:text-sm px-2">
      <p>Click the correct symbol to answer the question</p>
    </div>
  )
}
