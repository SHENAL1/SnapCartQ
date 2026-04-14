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

function Guarded({ children }: { children: React.ReactNode }) {
  return <OnboardingGuard>{children}</OnboardingGuard>
}

const router = createBrowserRouter([
  { path: '/welcome', element: <Welcome /> },
  { path: '/', element: <Guarded><Home /></Guarded> },
  { path: '/list/:id', element: <Guarded><ListDetail /></Guarded> },
  { path: '/history', element: <Guarded><ScanHistory /></Guarded> },
  { path: '/account', element: <Guarded><Account /></Guarded> },
  { path: '/settings', element: <Guarded><Settings /></Guarded> },
  { path: '/upgrade', element: <Guarded><Upgrade /></Guarded> },
])

export default function App() {
  return <RouterProvider router={router} />
}
