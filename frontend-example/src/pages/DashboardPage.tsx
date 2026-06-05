import DashboardHeader from '../components/DashboardHeader'
import CatalogHeading from '../components/CatalogHeading'
import mockUser from '../services/mockUser'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-ui-bg">
      <DashboardHeader user={mockUser} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <CatalogHeading semestre={mockUser.semestre} />

        {/* Conteúdo do catálogo — a implementar */}
        <div className="mt-8" />
      </main>
    </div>
  )
}
