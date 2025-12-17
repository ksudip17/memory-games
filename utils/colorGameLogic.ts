export const COLORS = [
  { name: "red", bg: "bg-red-500", glow: "shadow-red-500/50", active: "bg-red-600 scale-95" },
  { name: "blue", bg: "bg-blue-500", glow: "shadow-blue-500/50", active: "bg-blue-600 scale-95" },
  { name: "green", bg: "bg-green-500", glow: "shadow-green-500/50", active: "bg-green-600 scale-95" },
  { name: "yellow", bg: "bg-yellow-400", glow: "shadow-yellow-400/50", active: "bg-yellow-500 scale-95" },
]

export function generateRandomColor(): number {
  return Math.floor(Math.random() * COLORS.length)
}

export function playSequence(
  sequence: number[],
  onFlash: (index: number) => void,
  onComplete: () => void,
  speed = 600,
) {
  let i = 0
  const interval = setInterval(() => {
    if (i >= sequence.length) {
      clearInterval(interval)
      onComplete()
      return
    }
    onFlash(sequence[i])
    i++
  }, speed)
  return interval
}
