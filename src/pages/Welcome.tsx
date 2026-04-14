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

  const skip = () => finish()

  return (
    <div className="min-h-screen bg-indigo-600 flex flex-col">
      {/* Skip */}
      <div className="flex justify-end px-6 pt-6">
        {!slide.isFinal && (
          <button
            onClick={skip}
            className="text-indigo-200 text-sm font-medium hover:text-white transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="text-8xl mb-8 drop-shadow-lg">{slide.emoji}</div>
        <h1 className="text-2xl font-bold text-white mb-4 leading-tight">{slide.title}</h1>
        <p className="text-indigo-200 text-base leading-relaxed max-w-xs">{slide.description}</p>
      </div>

      {/* Bottom area */}
      <div className="px-8 pb-12 space-y-6">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all ${
                i === index ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-indigo-400'
              }`}
            />
          ))}
        </div>

        {/* CTA button */}
        {slide.isFinal ? (
          <button
            onClick={finish}
            className="w-full bg-white text-indigo-600 font-bold rounded-2xl py-4 text-base hover:bg-indigo-50 active:scale-[0.98] transition-all shadow-lg"
          >
            Get Started
          </button>
        ) : (
          <button
            onClick={next}
            className="w-full bg-white text-indigo-600 font-bold rounded-2xl py-4 text-base hover:bg-indigo-50 active:scale-[0.98] transition-all shadow-lg"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
