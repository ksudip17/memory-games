type GameStatus = "idle" | "countdown" | "playing" | "waiting" | "gameover"

interface GameBoardProps {
  gameStatus: GameStatus
  countdown: number
  simonSays: boolean
  currentInstruction: string
  isCorrect: boolean | null
  timeRemaining: number
  reactionTime: number
}

export default function GameBoard({
  gameStatus,
  countdown,
  simonSays,
  currentInstruction,
  isCorrect,
  timeRemaining,
  reactionTime,
}: GameBoardProps) {
  const getInstructionText = () => {
    if (gameStatus === "idle") {
      return "Press Start to Play!"
    }
    if (gameStatus === "countdown") {
      return countdown
    }
    if (gameStatus === "playing" || gameStatus === "waiting") {
      return simonSays ? `Simon says ${currentInstruction}!` : `${currentInstruction}!`
    }
    if (gameStatus === "gameover") {
      return "Game Over"
    }
    return ""
  }

  const getTextColor = () => {
    if (isCorrect === true) return "text-green-600"
    if (isCorrect === false) return "text-red-600"
    if (simonSays) return "text-green-600"
    return "text-amber-600"
  }

  return (
    <div className="mb-8">
      <div className="bg-slate-50 rounded-2xl p-8 min-h-[200px] flex items-center justify-center border border-slate-200">
        <div
          className={`text-center transition-all duration-500 ${
            gameStatus === "playing" || gameStatus === "waiting" ? "animate-fade-in scale-100" : "scale-95"
          }`}
        >
          <p className={`text-4xl md:text-6xl font-bold ${getTextColor()} transition-colors duration-300 text-balance`}>
            {getInstructionText()}
          </p>
          {(gameStatus === "playing" || gameStatus === "waiting") && (
            <p className="mt-4 text-slate-600 text-lg">{gameStatus === "playing" ? "Remember this!" : "ACT NOW!"}</p>
          )}
        </div>
      </div>

      {gameStatus === "waiting" && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm font-semibold text-slate-600">
            <span>Reaction Time</span>
            <span className={timeRemaining < 30 ? "text-red-500 animate-pulse" : ""}>
              {((timeRemaining / 100) * (reactionTime / 1000)).toFixed(2)}s
            </span>
          </div>
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
            <div
              className={`h-full transition-all duration-75 ${
                timeRemaining > 50 ? "bg-green-500" : timeRemaining > 30 ? "bg-yellow-500" : "bg-red-500 animate-pulse"
              }`}
              style={{ width: `${timeRemaining}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
