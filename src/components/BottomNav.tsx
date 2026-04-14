import { useLocation, useNavigate } from 'react-router-dom'
import { House, Clock, CircleUser } from 'lucide-react'

const tabs = [
  { path: '/', label: 'Home', Icon: House },
  { path: '/history', label: 'History', Icon: Clock },
  { path: '/account', label: 'Account', Icon: CircleUser },
]

const ACTIVE = '#19bfb7'
const INACTIVE = '#6b7280'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20" style={{ background: '#1e2022', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
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
                strokeWidth={isActive ? 2.2 : 1.7}
                stroke={isActive ? ACTIVE : INACTIVE}
                fill="none"
              />
              <span className="text-[10px] font-semibold" style={{ color: isActive ? ACTIVE : INACTIVE }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
