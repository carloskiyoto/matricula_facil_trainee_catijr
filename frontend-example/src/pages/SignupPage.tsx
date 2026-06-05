import SignupCard from '../components/SignupCard'
import { Page } from '../types'

interface SignupPageProps {
  onNavigate?: (page: Page) => void
}

export default function SignupPage({ onNavigate }: SignupPageProps) {
  return (
    <div className="min-h-screen w-full bg-ui-bg flex items-center justify-center px-4 py-8 sm:py-16">
      <div className="w-full max-w-[480px]">
        <SignupCard onNavigate={onNavigate} />
      </div>
    </div>
  )
}