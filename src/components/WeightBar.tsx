import { formatWeightKg } from '../lib/weight'

interface WeightBarProps {
  limitKg: number
  usedKg: number
}

export default function WeightBar({ limitKg, usedKg }: WeightBarProps) {
  const percentage = Math.min((usedKg / limitKg) * 100, 100)
  const isOver = usedKg > limitKg
  const isWarning = !isOver && percentage > 80

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Weight</span>
        <span className={`text-xs font-semibold ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
          {formatWeightKg(usedKg)} / {formatWeightKg(limitKg)}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            background: isOver ? '#ef4444' : isWarning ? '#f59e0b' : '#19bfb7',
          }}
        />
      </div>
    </div>
  )
}
