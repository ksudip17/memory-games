"use client"

interface ColorScoreProps {
  round: number
  bestScore: number
}

export default function ColorScore({ round, bestScore }: ColorScoreProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
        <p className="text-sm font-medium text-slate-600 mb-1">Current Round</p>
        <p className="text-3xl font-bold text-blue-600">{round}</p>
      </div>
      <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
        <p className="text-sm font-medium text-slate-600 mb-1">Best Score</p>
        <p className="text-3xl font-bold text-purple-600">{bestScore}</p>
      </div>
    </div>
  )
}
