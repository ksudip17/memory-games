"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import SignalBoard from "./SignalBoard"
import SignalControls from "./SignalControls"
import SignalScore from "./SignalScore"

type GameStatus = "idle" | "playing" | "gameover"
type Symbol = "⬤" | "▲" | "■" | "◆" | "★"
type Color = "red" | "blue" | "green" | "yellow" | "purple"

interface GameOption {
  id: number
  symbol: Symbol
  color: Color
  isCorrect: boolean
}

const SYMBOLS: Symbol[] = ["⬤", "▲", "■", "◆", "★"]
const COLORS: Color[] = ["red", "blue", "green", "yellow", "purple"]

const generateQuestion = (correctOption: GameOption): string => {
  const questionTypes = [
    `CLICK THE ${correctOption.color.toUpperCase()} SYMBOL`,
    `CLICK THE ${getSymbolName(correctOption.symbol).toUpperCase()}`,
    `CLICK THE ${correctOption.color.toUpperCase()} ${getSymbolName(correctOption.symbol).toUpperCase()}`,
  ]

  // Sometimes add OR logic for extra challenge
  if (Math.random() > 0.7) {
    const orType = Math.random() > 0.5 ? "color" : "shape"
    if (orType === "color") {
      const altColor = COLORS[Math.floor(Math.random() * COLORS.length)]
      return `CLICK ${correctOption.color.toUpperCase()} OR ${altColor.toUpperCase()}`
    } else {
      const altSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      return `CLICK ${getSymbolName(correctOption.symbol).toUpperCase()} OR ${getSymbolName(altSymbol).toUpperCase()}`
    }
  }

  return questionTypes[Math.floor(Math.random() * questionTypes.length)]
}

function getSymbolName(symbol: Symbol): string {
  const names: Record<Symbol, string> = {
    "⬤": "circle",
    "▲": "triangle",
    "■": "square",
    "◆": "diamond",
    "★": "star",
  }
  return names[symbol]
}

export default function SignalGameContainer() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle")
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [currentOptions, setCurrentOptions] = useState<GameOption[]>([])
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [timeLimit, setTimeLimit] = useState(1500)
  const [timeRemaining, setTimeRemaining] = useState(100)
  const [hasClicked, setHasClicked] = useState(false)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("signalOverrideBestScore")
    if (saved) setBestScore(Number.parseInt(saved))
  }, [])

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score)
      localStorage.setItem("signalOverrideBestScore", score.toString())
    }
  }, [score, bestScore])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [])

  const getTimeLimit = useCallback((currentScore: number) => {
    if (currentScore <= 5) return 2000 // Beginner: 2 seconds
    if (currentScore <= 10) return 1500 // Intermediate: 1.5 seconds
    if (currentScore <= 14) return 1000 // Advanced: 1 second
    return 900 // Elite: 900ms
  }, [])

  const isCorrectChoice = useCallback((option: GameOption, question: string): boolean => {
    const lowerQ = question.toLowerCase()
    const symbolName = getSymbolName(option.symbol).toLowerCase()
    const colorName = option.color.toLowerCase()

    // Handle OR logic
    if (lowerQ.includes(" or ")) {
      const parts = lowerQ.split(" or ")
      return parts.some((part) => part.includes(symbolName) || part.includes(colorName))
    }

    // Check if both color and symbol match
    if (lowerQ.includes(colorName) && lowerQ.includes(symbolName)) {
      return true
    }

    // Check if only color matches (when question asks for color only)
    if (lowerQ.includes(colorName) && !SYMBOLS.some((s) => lowerQ.includes(getSymbolName(s).toLowerCase()))) {
      return true
    }

    // Check if only symbol matches (when question asks for symbol only)
    if (lowerQ.includes(symbolName) && !COLORS.some((c) => lowerQ.includes(c))) {
      return true
    }

    return false
  }, [])

  const startNewRound = useCallback(() => {
    const optionCount = Math.floor(Math.random() * 3) + 3 // 3-5 options
    const usedCombos = new Set<string>()
    const options: GameOption[] = []

    for (let i = 0; i < optionCount; i++) {
      let symbol: Symbol
      let color: Color
      let combo: string

      // Ensure unique combinations
      do {
        symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        color = COLORS[Math.floor(Math.random() * COLORS.length)]
        combo = `${symbol}-${color}`
      } while (usedCombos.has(combo))

      usedCombos.add(combo)
      options.push({
        id: i,
        symbol,
        color,
        isCorrect: false,
      })
    }

    // Pick one as correct and generate question
    const correctIndex = Math.floor(Math.random() * options.length)
    options[correctIndex].isCorrect = true
    const question = generateQuestion(options[correctIndex])

    setCurrentOptions(options)
    setCurrentQuestion(question)
    setHasClicked(false)
    setFeedback(null)
    setTimeRemaining(100)

    const currentTimeLimit = getTimeLimit(score)
    setTimeLimit(currentTimeLimit)

    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

    timerRef.current = setTimeout(() => {
      if (!hasClicked) {
        setGameStatus("gameover")
      }
    }, currentTimeLimit)

    const startTime = Date.now()
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / currentTimeLimit) * 100)
      setTimeRemaining(remaining)
      if (remaining === 0) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      }
    }, 16)
  }, [score, getTimeLimit, hasClicked])

  const startGame = useCallback(() => {
    setScore(0)
    setGameStatus("playing")
    setHasClicked(false)
    setFeedback(null)
    setTimeout(() => {
      startNewRound()
    }, 100)
  }, [startNewRound])

  const handleOptionClick = useCallback(
    (optionId: number) => {
      if (gameStatus !== "playing" || hasClicked) return

      setHasClicked(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

      const clickedOption = currentOptions.find((opt) => opt.id === optionId)
      if (!clickedOption) return

      const isCorrect = isCorrectChoice(clickedOption, currentQuestion)

      if (isCorrect) {
        setFeedback("correct")
        setScore((prev) => prev + 1)
        setTimeout(() => {
          startNewRound()
        }, 600)
      } else {
        setFeedback("incorrect")
        setTimeout(() => {
          setGameStatus("gameover")
        }, 800)
      }
    },
    [gameStatus, hasClicked, currentOptions, currentQuestion, isCorrectChoice, startNewRound],
  )

  const restartGame = useCallback(() => {
    setGameStatus("idle")
    setScore(0)
    setFeedback(null)
    setHasClicked(false)
    setTimeRemaining(100)
    setCurrentOptions([])
    setCurrentQuestion("")
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
  }, [])

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
      <h2 className="text-4xl font-bold text-center text-slate-800 mb-2 text-balance">
        Signal <span className="text-purple-600">Override</span>
      </h2>
      <p className="text-center text-slate-600 mb-6 text-pretty">Test your reflexes and cognitive flexibility</p>

      <SignalScore score={score} bestScore={bestScore} />

      <SignalBoard
        gameStatus={gameStatus}
        currentOptions={currentOptions}
        currentQuestion={currentQuestion}
        timeRemaining={timeRemaining}
        feedback={feedback}
        onOptionClick={handleOptionClick}
        hasClicked={hasClicked}
      />

      <SignalControls gameStatus={gameStatus} onStart={startGame} onRestart={restartGame} />

      {gameStatus === "gameover" && (
        <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center animate-shake">
          <p className="text-2xl font-bold text-red-600 mb-2">Game Over!</p>
          <p className="text-slate-700">Final Score: {score}</p>
        </div>
      )}
    </div>
  )
}
