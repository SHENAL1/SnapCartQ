import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import ListDetail from './pages/ListDetail'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/list/:id', element: <ListDetail /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
