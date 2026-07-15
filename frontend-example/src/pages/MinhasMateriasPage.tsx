import DashboardHeader from '../components/DashboardHeader'
import mockUser from '../services/mockUser'
import { Disciplina } from "../types"
import DisciplinaCard from "../components/DisciplinaCard"

interface MinhasMateriasPageProps {
    disciplinas: Disciplina[]
    setDisciplinas: React.Dispatch<React.SetStateAction<Disciplina[]>>
    setCreditosTotais: React.Dispatch<React.SetStateAction<number>>
}

export default function MinhasMateriasPage({ disciplinas, setDisciplinas, setCreditosTotais }: MinhasMateriasPageProps) {

    // ✨ Filtra localmente sem fazer uma nova requisição ao servidor!
    const minhasDisciplinas = disciplinas.filter(materia => materia.matriculada === true)

    const handleCancelamento = (materiaId: number, creditos: number) => {
        setCreditosTotais(prev => prev - creditos)
        setDisciplinas(prev => prev.map(d => d.id === materiaId ? { ...d, matriculada: false } : d))
    }

    return (
        <div className="min-h-screen bg-ui-bg">
            <DashboardHeader user={mockUser} />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-ui-dark">Minhas Matérias</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {minhasDisciplinas.length === 0 ? (
                        <p className="text-ui-muted col-span-full">Nenhuma matéria matriculada.</p>
                    ) : (
                        minhasDisciplinas.map((materia) => (
                            <DisciplinaCard
                                key={materia.id}
                                disciplina={materia}
                                creditosTotais={0}
                                modoMinhasMaterias={true}
                                onCancelamentoSucesso={() => handleCancelamento(materia.id, materia.creditos)}
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}