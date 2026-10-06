'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, Layers, Rocket, Music, Users, Shield, ArrowUpRight } from 'lucide-react'

const UPCOMING_FEATURES = [
  {
    icon: Users,
    title: 'Multiplayer Team Wheels',
    desc: 'Spin decisions together live with your team or study group in real-time synced rooms.',
    tag: 'In Development',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Music,
    title: 'Integrated Lofi Radio',
    desc: 'Stream soothing chillhop and focus beats while your 25m task timer counts down.',
    tag: 'Coming Q2',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Layers,
    title: 'Custom Physics & 3D Themes',
    desc: 'Cyberpunk neon, wood antique, retro arcade, and cosmic wheel visual skins.',
    tag: 'Concept',
    color: 'from-amber-500 to-red-500'
  },
  {
    icon: Shield,
    title: 'Cloud Habit & Streak Sync',
    desc: 'Track daily completed tasks across mobile and desktop with detailed productivity analytics.',
    tag: 'Planned',
    color: 'from-emerald-500 to-teal-500'
  }
]

export default function PortfolioPage() {
  return (
    <div className="relative min-h-screen pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
      
      {/* Background Video with Dark Overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-20 opacity-25 filter contrast-125 saturate-150"
      >
        <source src="/Videos/fav.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[#070913]/90 backdrop-blur-md -z-10" />

      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-white/10 text-xs font-semibold text-pink-300 mb-4 shadow-lg shadow-pink-500/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Future Roadmap & Portfolio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Not just a wheel — <br />
            <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              A glimpse into the future.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Explore what's currently being crafted in Sagar's lab for the next evolution of Spinly and creative web apps.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {UPCOMING_FEATURES.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="glass-card rounded-3xl p-6 border border-white/10 hover:border-white/25 transition duration-300 group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition`} />
                
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-tr ${item.color} text-white shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Sagar's GitHub CTA */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-3">
            <Rocket className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Want to collaborate or view source?</h3>
          <p className="mt-2 text-sm text-slate-400 max-w-md">
            Check out open-source repositories and connect with Sagar on GitHub.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="https://github.com/SagarNow"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center gap-2 transition"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Explore @SagarNow on GitHub</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/#wheel-studio"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:brightness-110 active:brightness-95 transition"
            >
              Back To The Wheel
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}