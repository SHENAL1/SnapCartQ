import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { markOnboarded } from '../lib/scanHistory'

const slides = [
  {
    emoji: '📸',
    title: 'Snap a photo, build your list',
    description:
      'Take a photo of any product tag or price label. Claude AI instantly reads the product name, price, and weight — no typing needed.',
  },
  {
    emoji: '⚖️',
    title: 'Track your budget & weight',
    description:
      'Set a budget and luggage weight limit per list. Get live progress bars and alerts so you never go over — perfect for travel shopping.',
  },
  {
    emoji: '🛒',
    title: 'Shop smart, travel light',
    description:
      'Organise shopping trips, manage multiple currencies, and export your list as a file. Your data stays on your device — private and fast.',
    isFinal: true,
  },
]

export default function Welcome() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const slide = slides[index]

  const finish = () => {
    markOnboarded()
    navigate('/', { replace: true })
  }

  const next = () => {
    if (index < slides.length - 1) setIndex(index + 1)
    else finish()
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1e2022' }}>
      {/* Logo + Skip */}
      <div className="flex items-center justify-between px-6 pt-8">
        <img src="/logo-white.png" alt="SnapCartQ" className="h-6 object-contain" />
        {!slide.isFinal && (
          <button
            onClick={finish}
            className="text-white/40 text-sm font-medium hover:text-white/70 transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div
          className="w-28 h-28 rounded-3xl flex items-center justify-center mb-8 text-6xl"
          style={{ background: 'rgba(25,191,183,0.15)' }}
        >
          {slide.emoji}
        </div>
        <h1 className="text-2xl font-bold text-white mb-4 leading-tight">{slide.title}</h1>
        <p className="text-white/50 text-base leading-relaxed max-w-xs">{slide.description}</p>
      </div>

      {/* Bottom */}
      <div className="px-8 pb-12 space-y-6">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="rounded-full transition-all"
              style={{
                width: i === index ? 24 : 8,
                height: 8,
                background: i === index ? '#19bfb7' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          className="w-full font-bold rounded-2xl py-4 text-base active:scale-[0.98] transition-all shadow-lg text-white"
          style={{ background: '#19bfb7' }}
        >
          {slide.isFinal ? 'Get Started' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
