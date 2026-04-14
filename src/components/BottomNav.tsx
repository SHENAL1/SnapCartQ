import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Clock, User } from 'lucide-react'

const tabs = [
  { path: '/', label: 'Home', Icon: Home },
  { path: '/history', label: 'History', Icon: Clock },
  { path: '/account', label: 'Account', Icon: User },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark border-t border-white/10 z-20">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex-1 flex flex-col items-center py-3 gap-1 transition-colors"
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.8}
                color={isActive ? '#19bfb7' : '#6b7280'}
              />
              <span
                className="text-[10px] font-semibold"
                style={{ color: isActive ? '#19bfb7' : '#6b7280' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
