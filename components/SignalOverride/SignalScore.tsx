interface SignalScoreProps {
  score: number
  bestScore: number
}

export default function SignalScore({ score, bestScore }: SignalScoreProps) {
  return (
    <div className="flex justify-between items-center mb-4 sm:mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-200">
      <div className="text-center flex-1">
        <p className="text-xs sm:text-sm text-slate-600 font-semibold">Score</p>
        <p className="text-2xl sm:text-3xl font-bold text-purple-600">{score}</p>
      </div>
      <div className="w-px h-8 sm:h-10 md:h-12 bg-purple-200" />
      <div className="text-center flex-1">
        <p className="text-xs sm:text-sm text-slate-600 font-semibold">Best</p>
        <p className="text-2xl sm:text-3xl font-bold text-pink-600">{bestScore}</p>
      </div>
    </div>
  )
}
