import { Card } from "@/components/ui/card"

interface ScoreBoardProps {
  score: number
  highScore: number
}

export default function ScoreBoard({ score, highScore }: ScoreBoardProps) {
  return (
    <Card className="bg-white border-slate-200 p-6 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <p className="text-slate-500 text-sm uppercase tracking-wide mb-1">Score</p>
          <p className="text-4xl font-bold text-slate-800">{score}</p>
        </div>
        <div className="w-px h-12 bg-slate-200" />
        <div className="text-center flex-1">
          <p className="text-slate-500 text-sm uppercase tracking-wide mb-1">High Score</p>
          <p className="text-4xl font-bold text-amber-500">{highScore}</p>
        </div>
      </div>
    </Card>
  )
}
