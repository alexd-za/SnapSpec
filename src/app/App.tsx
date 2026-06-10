import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useSnapStore } from '../lib/storage/store'
import { useAccent } from '../lib/hooks/useAccent'

export default function App() {
  const accent = useSnapStore((s) => s.settings.defaultAccent)
  useAccent(accent)
  return <RouterProvider router={router} />
}
