import DashboardHeader from '../components/DashboardHeader'
import mockUser from '../services/mockUser'
import { Disciplina } from "../types"
import DisciplinaCard from "../components/DisciplinaCard"

interface DashboardPageProps {
    disciplinas: Disciplina[]
    setDisciplinas: React.Dispatch<React.SetStateAction<Disciplina[]>>
    creditosTotais: number
    setCreditosTotais: React.Dispatch<React.SetStateAction<number>>
}

export default function DashboardPage({ disciplinas, setDisciplinas, creditosTotais, setCreditosTotais }: DashboardPageProps) {

    // Função chamada quando matricula no card (atualiza localmente o estado global)
    const handleMatricula = (materiaId: number, creditos: number) => {
        setCreditosTotais(prev => prev + creditos)
        setDisciplinas(prev => prev.map(d => d.id === materiaId ? { ...d, matriculada: true } : d))
    }

    // Função chamada quando cancela no card (atualiza localmente o estado global)
    const handleCancelamento = (materiaId: number, creditos: number) => {
        setCreditosTotais(prev => prev - creditos)
        setDisciplinas(prev => prev.map(d => d.id === materiaId ? { ...d, matriculada: false } : d))
    }

    return (
        <div className="min-h-screen bg-ui-bg">
            <DashboardHeader user={mockUser} />
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Seu layout da barra de créditos e título aqui */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {disciplinas.map((materia) => (
                        <DisciplinaCard
                            key={materia.id}
                            disciplina={materia}
                            creditosTotais={creditosTotais}
                            modoMinhasMaterias={false}
                            onMatriculaSucesso={() => handleMatricula(materia.id, materia.creditos)}
                            onCancelamentoSucesso={() => handleCancelamento(materia.id, materia.creditos)}
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}