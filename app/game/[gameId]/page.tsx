"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import GameBoard from "@/components/GameBoard"
import ControlPanel from "@/components/ControlPanel"
import ScoreBoard from "@/components/ScoreBoard"
import InstructionModal from "@/components/InstructionModal"
import ColorGameContainer from "@/components/ColorGame/ColorGameContainer"
import SignalGameContainer from "@/components/SignalOverride/SignalGameContainer"

type GameStatus = "idle" | "countdown" | "playing" | "waiting" | "gameover"

const actions = ["Jump", "Clap", "Touch Head", "Turn Around"]

export default function GamePage() {
  const params = useParams()
  const gameId = params.gameId as string

  const [currentInstruction, setCurrentInstruction] = useState("")
  const [simonSays, setSimonSays] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle")
  const [countdown, setCountdown] = useState(3)
  const [showModal, setShowModal] = useState(true)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [reactionTime, setReactionTime] = useState(2000)
  const [timeRemaining, setTimeRemaining] = useState(100)
  const [hasResponded, setHasResponded] = useState(false)
  const [gameOverReason, setGameOverReason] = useState("")

  const reactionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const getReactionTime = useCallback((currentScore: number) => {
    if (currentScore <= 5) return 2000
    if (currentScore <= 10) return 1500
    return 1000
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem("simonSaysHighScore")
    if (saved) setHighScore(Number.parseInt(saved))
  }, [])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("simonSaysHighScore", score.toString())
    }
  }, [score, highScore])

  useEffect(() => {
    return () => {
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current)
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameStatus !== "waiting") return
      const keyMap: { [key: string]: string } = {
        "1": "Jump",
        "2": "Clap",
        "3": "Touch Head",
        "4": "Turn Around",
      }
      if (keyMap[e.key]) {
        handleAction(keyMap[e.key])
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameStatus, simonSays, currentInstruction, hasResponded])

  const startGame = useCallback(() => {
    setScore(0)
    setGameStatus("countdown")
    setCountdown(3)
    setGameOverReason("")
  }, [])

  const nextRound = useCallback(() => {
    setGameStatus("countdown")
    setCountdown(3)
    setSelectedAction(null)
    setIsCorrect(null)
    setHasResponded(false)
  }, [])

  useEffect(() => {
    if (gameStatus === "countdown") {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 800)
        return () => clearTimeout(timer)
      } else {
        const randomAction = actions[Math.floor(Math.random() * actions.length)]
        const shouldSaySimon = Math.random() > 0.5
        setCurrentInstruction(randomAction)
        setSimonSays(shouldSaySimon)
        setGameStatus("playing")
      }
    }
  }, [gameStatus, countdown])

  useEffect(() => {
    if (gameStatus === "playing") {
      const timer = setTimeout(() => {
        setGameStatus("waiting")
        setHasResponded(false)
        const currentReactionTime = getReactionTime(score)
        setReactionTime(currentReactionTime)
        setTimeRemaining(100)

        reactionTimerRef.current = setTimeout(() => {
          if (!hasResponded) {
            setGameOverReason("Too Slow!")
            setGameStatus("gameover")
          }
        }, currentReactionTime)

        const startTime = Date.now()
        progressIntervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime
          const remaining = Math.max(0, 100 - (elapsed / currentReactionTime) * 100)
          setTimeRemaining(remaining)
          if (remaining === 0) {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
          }
        }, 16)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [gameStatus, score, getReactionTime, hasResponded])

  const handleAction = useCallback(
    (action: string) => {
      if (gameStatus !== "waiting" || hasResponded) return

      setHasResponded(true)
      setSelectedAction(action)

      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

      const correct = simonSays ? action === currentInstruction : action !== currentInstruction

      if (correct) {
        setIsCorrect(true)
        setScore((prev) => prev + 1)

        setTimeout(() => {
          nextRound()
        }, 600)
      } else {
        setIsCorrect(false)
        setGameOverReason("Wrong Action!")
        setGameStatus("gameover")
      }
    },
    [gameStatus, simonSays, currentInstruction, nextRound, hasResponded],
  )

  const restartGame = useCallback(() => {
    setGameStatus("idle")
    setScore(0)
    setCurrentInstruction("")
    setSelectedAction(null)
    setIsCorrect(null)
    setHasResponded(false)
    setGameOverReason("")
    setTimeRemaining(100)
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
  }, [])

  if (gameId === "color-game") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <ColorGameContainer />
        </div>
      </div>
    )
  }

  if (gameId === "signal-override") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <SignalGameContainer />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 py-12">
      <InstructionModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div className="w-full max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <ScoreBoard score={score} highScore={highScore} />

        <div className="mt-6 bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-8 text-balance">
            Simon Says <span className="text-red-500">FAST REFLEX</span>
          </h2>

          <GameBoard
            gameStatus={gameStatus}
            countdown={countdown}
            simonSays={simonSays}
            currentInstruction={currentInstruction}
            isCorrect={isCorrect}
            timeRemaining={timeRemaining}
            reactionTime={reactionTime}
          />

          <ControlPanel
            gameStatus={gameStatus}
            actions={actions}
            onAction={handleAction}
            onStart={startGame}
            onRestart={restartGame}
            selectedAction={selectedAction}
            isCorrect={isCorrect}
          />

          {gameStatus === "gameover" && (
            <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center animate-shake">
              <p className="text-2xl font-bold text-red-600 mb-2">{gameOverReason}</p>
              <p className="text-slate-700">Final Score: {score}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
