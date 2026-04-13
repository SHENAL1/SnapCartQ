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
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500 font-medium">Weight</span>
        <span className={isOver ? 'text-red-600 font-semibold' : 'text-gray-700'}>
          {formatWeightKg(usedKg)} / {formatWeightKg(limitKg)}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOver ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isWarning && (
        <p className="text-xs text-amber-600">{Math.round(100 - percentage)}% weight remaining</p>
      )}
    </div>
  )
}
