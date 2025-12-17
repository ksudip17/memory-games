"use client"
import Link from "next/link"

export default function HomePage() {
  const games = [
    {
      id: "simon-says",
      title: "Simon Says",
      subtitle: "Fast Reaction Mode",
      description: "Follow the instructions only when Simon says so. Test your reflexes and decision-making skills.",
      color: "from-blue-500 to-indigo-600",
      hoverColor: "hover:shadow-blue-500/50",
    },
    {
      id: "color-game",
      title: "Color Touching Sequence",
      subtitle: "Memory Game",
      description: "Memorize and repeat the sequence of colors. How far can your memory take you?",
      color: "from-purple-500 to-pink-600",
      hoverColor: "hover:shadow-purple-500/50",
    },
    {
      id: "signal-override",
      title: "Signal Override",
      subtitle: "Cognitive Reflex Test",
      description:
        "Test your reflexes and cognitive flexibility with multiple symbols, colors, and dynamic questions under increasing speed.",
      color: "from-pink-500 to-rose-600",
      hoverColor: "hover:shadow-pink-500/50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 text-balance">Reflex & Memory Arcade</h1>
          <p className="text-xl text-slate-300 text-balance">Choose your challenge and test your skills</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {games.map((game) => (
            <Link key={game.id} href={`/game/${game.id}`}>
              <div
                className={`group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${game.hoverColor} cursor-pointer`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-20 rounded-3xl group-hover:opacity-30 transition-opacity`}
                />
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-white mb-2 text-balance">{game.title}</h2>
                  <p className="text-lg text-blue-300 font-semibold mb-4">{game.subtitle}</p>
                  <p className="text-slate-300 mb-6 text-pretty">{game.description}</p>
                  <button className="w-full bg-white text-slate-900 font-bold py-3 px-6 rounded-xl hover:bg-slate-100 transition-colors">
                    Play Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <p className="text-slate-400 text-lg">Made by Sudip</p>
        </div>
      </div>
    </div>
  )
}
