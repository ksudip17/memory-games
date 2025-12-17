"use client"

type GameStatus = "idle" | "playing" | "gameover"
type Symbol = "⬤" | "▲" | "■" | "◆" | "★"
type Color = "red" | "blue" | "green" | "yellow" | "purple"

interface GameOption {
  id: number
  symbol: Symbol
  color: Color
  isCorrect: boolean
}

interface SignalBoardProps {
  gameStatus: GameStatus
  currentOptions: GameOption[]
  currentQuestion: string
  timeRemaining: number
  feedback: "correct" | "incorrect" | null
  onOptionClick: (optionId: number) => void
  hasClicked: boolean
}

const colorMap: Record<Color, string> = {
  red: "text-red-500 border-red-500 hover:bg-red-50",
  blue: "text-blue-500 border-blue-500 hover:bg-blue-50",
  green: "text-green-500 border-green-500 hover:bg-green-50",
  yellow: "text-yellow-500 border-yellow-500 hover:bg-yellow-50",
  purple: "text-purple-500 border-purple-500 hover:bg-purple-50",
}

export default function SignalBoard({
  gameStatus,
  currentOptions,
  currentQuestion,
  timeRemaining,
  feedback,
  onOptionClick,
  hasClicked,
}: SignalBoardProps) {
  if (gameStatus === "idle") {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-12 mb-6 text-center border border-slate-200">
        <p className="text-slate-600 text-lg">Click Start to begin the challenge</p>
      </div>
    )
  }

  const getBgColor = () => {
    if (feedback === "correct") return "bg-green-100"
    if (feedback === "incorrect") return "bg-red-100"
    return "bg-gradient-to-br from-slate-50 to-slate-100"
  }

  return (
    <div className={`${getBgColor()} rounded-2xl p-8 mb-6 border border-slate-200 transition-colors`}>
      <div className="mb-6 text-center">
        <div className="inline-block px-6 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
          {currentQuestion}
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-6 mb-6 min-h-[180px]">
        {currentOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onOptionClick(option.id)}
            disabled={hasClicked}
            className={`
              text-7xl font-bold border-4 rounded-2xl p-6 
              transition-all duration-200 
              ${colorMap[option.color]}
              ${hasClicked ? "opacity-50 cursor-not-allowed" : "hover:scale-110 cursor-pointer active:scale-95"}
              ${feedback === "correct" && option.isCorrect ? "scale-125 animate-pulse" : ""}
              ${feedback === "incorrect" && !option.isCorrect ? "animate-shake" : ""}
            `}
          >
            {option.symbol}
          </button>
        ))}
      </div>

      {gameStatus === "playing" && (
        <div className="mt-4">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-75 ${
                timeRemaining > 60 ? "bg-green-500" : timeRemaining > 30 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${timeRemaining}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
