import DashboardHeader from '../components/DashboardHeader'
import CatalogHeading from '../components/CatalogHeading'
import mockUser from '../services/mockUser'
import { useState, useEffect } from 'react'
import { Disciplina } from "../types"
import DisciplinaCard from "../components/DisciplinaCard"
import BarraCreditos from "../components/BarraCreditos"

export default function DashboardPage() {
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
    const [creditosTotais, setCreditosTotais] = useState(0)

    useEffect(() => {
        async function buscarDisciplinas() {
            try {
                const resposta = await fetch('http://localhost:8080/disciplinas')
                if (resposta.ok) {
                    const dados = await resposta.json()
                    setDisciplinas(dados)
                }
            } catch (erro) {
                console.error(erro)
            }
        }

        buscarDisciplinas()
    }, [])

    return (
        <div className="min-h-screen bg-ui-bg">
            <DashboardHeader user={mockUser} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                <CatalogHeading semestre={mockUser.semestre} />

                <div className="flex justify-end mb-6 mt-4">
                    <BarraCreditos creditosAtuais={creditosTotais} creditosMaximos={20} />
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {disciplinas.length === 0 ? (
                        <p className="text-ui-muted">Carregando catálogo...</p>
                    ) : (
                        disciplinas.map((materia) => (
                            <DisciplinaCard
                                key={materia.id}
                                disciplina={materia}
                                onMatriculaSucesso={(creditos) => setCreditosTotais(prev => prev + creditos)}
                                onCancelamentoSucesso={(creditos) => setCreditosTotais(prev => prev - creditos)}
                            />
                        ))
                    )}
                </div>
                <div className="mt-8" />
            </main>
        </div>
    )
}