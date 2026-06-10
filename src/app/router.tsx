import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { Home } from '../routes/Home'
import { NewSnap } from '../routes/NewSnap'
import { Editor } from '../routes/Editor'
import { Gallery } from '../routes/Gallery'
import { Exports } from '../routes/Exports'
import { Settings } from '../routes/Settings'
import { NotFound } from '../routes/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'new', element: <NewSnap /> },
      { path: 'editor/:id', element: <Editor /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'exports', element: <Exports /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
