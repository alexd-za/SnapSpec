import { Link } from 'react-router-dom'
import { MossPanel } from '../components/nature/MossPanel'

export function NotFound() {
  return (
    <MossPanel className="mx-auto max-w-md p-10 text-center">
      <img
        src="/generated/svg/33-empty-gallery.svg"
        alt=""
        className="mx-auto mb-6 h-36 w-36 opacity-80"
      />
      <h1 className="font-serif text-2xl">This trail leads nowhere</h1>
      <p className="annotation mt-2 text-base">this page fell out of the binder</p>
      <Link to="/" className="mt-6 inline-block text-sm text-accent hover:underline">
        ← Back to the clearing
      </Link>
    </MossPanel>
  )
}
