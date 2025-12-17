"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import ColorBoard from "./ColorBoard"
import ColorControls from "./ColorControls"
import ColorScore from "./ColorScore"
import { generateRandomColor } from "@/utils/colorGameLogic"

type GameStatus = "idle" | "playing" | "gameover"

export default function ColorGameContainer() {
  const [colorSequence, setColorSequence] = useState<number[]>([])
  const [userSequence, setUserSequence] = useState<number[]>([])
  const [activeColor, setActiveColor] = useState<number | null>(null)
  const [isPlayingSequence, setIsPlayingSequence] = useState(false)
  const [round, setRound] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle")
  const [speed, setSpeed] = useState(600)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("colorGameBestScore")
    if (saved) setBestScore(Number.parseInt(saved))
  }, [])

  // Update best score
  useEffect(() => {
    if (round > bestScore) {
      setBestScore(round)
      localStorage.setItem("colorGameBestScore", round.toString())
    }
  }, [round, bestScore])

  // Keyboard support (Q/W/A/S)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isPlayingSequence || gameStatus !== "playing") return
      const keyMap: { [key: string]: number } = {
        q: 0,
        w: 1,
        a: 2,
        s: 3,
      }
      if (keyMap[e.key.toLowerCase()] !== undefined) {
        handleColorClick(keyMap[e.key.toLowerCase()])
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isPlayingSequence, gameStatus, userSequence])

  const startGame = useCallback(() => {
    const initialColor = generateRandomColor()
    setColorSequence([initialColor])
    setUserSequence([])
    setRound(1)
    setSpeed(600)
    setGameStatus("playing")
    playSequence([initialColor])
  }, [])

  const playSequence = useCallback(
    (sequence: number[]) => {
      setIsPlayingSequence(true)
      let i = 0

      const flashNext = () => {
        if (i >= sequence.length) {
          setIsPlayingSequence(false)
          return
        }

        setActiveColor(sequence[i])
        timeoutRef.current = setTimeout(() => {
          setActiveColor(null)
          timeoutRef.current = setTimeout(() => {
            i++
            flashNext()
          }, 200)
        }, speed)
      }

      flashNext()
    },
    [speed],
  )

  const handleColorClick = useCallback(
    (colorIndex: number) => {
      if (isPlayingSequence || gameStatus !== "playing") return

      setActiveColor(colorIndex)
      setTimeout(() => setActiveColor(null), 300)

      const newUserSequence = [...userSequence, colorIndex]
      setUserSequence(newUserSequence)

      // Check if correct
      if (colorIndex !== colorSequence[newUserSequence.length - 1]) {
        // Wrong color - game over
        setGameStatus("gameover")
        return
      }

      // Check if sequence complete
      if (newUserSequence.length === colorSequence.length) {
        // Correct sequence - next round
        const newColor = generateRandomColor()
        const newSequence = [...colorSequence, newColor]

        setTimeout(() => {
          setColorSequence(newSequence)
          setUserSequence([])
          setRound((prev) => prev + 1)
          // Increase speed after round 5
          if (round >= 5) {
            setSpeed((prev) => Math.max(300, prev - 50))
          }
          playSequence(newSequence)
        }, 800)
      }
    },
    [isPlayingSequence, gameStatus, userSequence, colorSequence, round, playSequence],
  )

  const restartGame = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setGameStatus("idle")
    setColorSequence([])
    setUserSequence([])
    setRound(0)
    setSpeed(600)
    setActiveColor(null)
    setIsPlayingSequence(false)
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ColorScore round={round} bestScore={bestScore} />

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-8 text-balance">Color Memory Game</h2>

        {gameStatus === "playing" && (
          <div className="mb-6 text-center">
            <p className="text-lg font-semibold text-slate-700">
              {isPlayingSequence ? "Watch the sequence..." : "Your turn!"}
            </p>
          </div>
        )}

        <ColorBoard
          activeColor={activeColor}
          isDisabled={isPlayingSequence || gameStatus !== "playing"}
          onColorClick={handleColorClick}
        />

        <ColorControls gameStatus={gameStatus} onStart={startGame} onRestart={restartGame} />

        {gameStatus === "gameover" && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center animate-shake">
            <p className="text-2xl font-bold text-red-600 mb-2">Game Over!</p>
            <p className="text-slate-700">You reached round {round}</p>
          </div>
        )}
      </div>
    </div>
  )
}
