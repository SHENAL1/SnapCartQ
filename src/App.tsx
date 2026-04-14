import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import ListDetail from './pages/ListDetail'
import Welcome from './pages/Welcome'
import Account from './pages/Account'
import ScanHistory from './pages/ScanHistory'
import Settings from './pages/Settings'
import Upgrade from './pages/Upgrade'
import { isOnboarded } from './lib/scanHistory'

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  useEffect(() => {
    if (!isOnboarded()) {
      navigate('/welcome', { replace: true })
    }
  }, [navigate])
  return <>{children}</>
}

function GuardedHome() {
  return <OnboardingGuard><Home /></OnboardingGuard>
}

const router = createBrowserRouter([
  { path: '/welcome', element: <Welcome /> },
  { path: '/', element: <GuardedHome /> },
  { path: '/list/:id', element: <ListDetail /> },
  { path: '/history', element: <ScanHistory /> },
  { path: '/account', element: <Account /> },
  { path: '/settings', element: <Settings /> },
  { path: '/upgrade', element: <Upgrade /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
