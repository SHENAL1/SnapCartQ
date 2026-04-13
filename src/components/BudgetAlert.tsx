interface BudgetAlertProps {
  budget: number
  spent: number
  onExtend: (newBudget: number) => void
}

export default function BudgetAlert({ budget, spent, onExtend }: BudgetAlertProps) {
  const overage = spent - budget
  const suggestedBudget = Math.ceil(spent / 10) * 10

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
      <span className="text-xl mt-0.5">⚠️</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-red-800 text-sm">
          Budget exceeded by ${overage.toFixed(2)}
        </p>
        <p className="text-xs text-red-600 mt-0.5">
          Spent ${spent.toFixed(2)} of ${budget.toFixed(2)} budget
        </p>
        <button
          onClick={() => onExtend(suggestedBudget)}
          className="mt-2 text-sm font-semibold text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-lg transition-colors"
        >
          Extend to ${suggestedBudget.toFixed(2)}
        </button>
      </div>
    </div>
  )
}
