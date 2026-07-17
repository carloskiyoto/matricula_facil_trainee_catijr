import DashboardHeader from '../components/DashboardHeader'
import mockUser from '../services/mockUser'
import { Disciplina } from "../types"
import DisciplinaCard from "../components/DisciplinaCard"
import BarraCreditos from '../components/BarraCreditos'
import { useState } from 'react'
interface DashboardPageProps {
    disciplinas: Disciplina[]
    setDisciplinas: React.Dispatch<React.SetStateAction<Disciplina[]>>
    creditosTotais: number
    setCreditosTotais: React.Dispatch<React.SetStateAction<number>>
    usuarioLogado: any
}

export default function DashboardPage({ disciplinas, setDisciplinas, creditosTotais, setCreditosTotais, usuarioLogado }: DashboardPageProps) {

    const [filtroDepartamento, setFiltroDepartamento] = useState('')
    const [filtroPeriodo, setFiltroPeriodo] = useState('')

    //cria um array dos departamentos e periodos com base nos cadastrados
    const departamentos = Array.from(new Set(disciplinas.map(d => d.departamento))).filter(Boolean)
    const periodos = Array.from(new Set(disciplinas.map(d => d.periodo))).filter(Boolean).sort((a, b) => Number(a) - Number(b))

    const [buscaTexto, setBuscaTexto] = useState<string>('')

    const disciplinasFiltradas = disciplinas.filter(materia => {
            const matchDepartamento = filtroDepartamento === '' || materia.departamento === filtroDepartamento
            const matchPeriodo = filtroPeriodo === '' || String(materia.periodo) === filtroPeriodo


            // funciona mesmo se o usuário digitar em maiusculo ou minusculo
            const nomeMateria = materia.nome ? materia.nome.toLowerCase() : ''
            const codigoMateria = materia.codigo ? materia.codigo.toLowerCase() : ''
            const textoPesquisado = buscaTexto.toLowerCase()

            //aceita se o texto estiver contido no nome ou codigo
            const matchTexto = nomeMateria.includes(textoPesquisado) || codigoMateria.includes(textoPesquisado)

            return matchDepartamento && matchPeriodo && matchTexto
        })

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
                <DashboardHeader user={usuarioLogado} />


                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                    {/* O Título e a Barra de Créditos  */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-ui-dark">Catálogo de Matérias</h2>
                            <p className="text-ui-muted mt-1">Selecione as disciplinas para o semestre 2026.2</p>
                        </div>

                        {/* Barra de Créditos */}
                        <div className="flex justify-end">
                            <BarraCreditos creditosAtuais={creditosTotais} creditosMaximos={20} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 md:items-end w-full">

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* 1. Select de Departamentos com estilo condicional */}
                            <select
                                className={
                                    filtroDepartamento === ''
                                        ? "w-full sm:w-auto border border-slate-500 rounded-full p-2 bg-brand-primary text-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
                                        : "w-full sm:w-auto border border-slate-300 rounded-full p-2 bg-ui-bg text-ui-dark shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                }
                                value={filtroDepartamento}
                                onChange={(e) => setFiltroDepartamento(e.target.value)}
                            >
                                <option value="">Todos os Departamentos</option>
                                {departamentos.map(dep => (
                                    <option key={dep} value={dep} className="bg-white text-slate-700">{dep}</option>
                                ))}
                            </select>

                            {/* 2. Select de Períodos com estilo condicional */}
                            <select
                                className={
                                    filtroPeriodo === ''
                                        ? "w-full sm:w-auto border border-slate-500 rounded-full p-2 bg-brand-primary text-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
                                        : "w-full sm:w-auto border border-slate-300 rounded-full p-2 bg-slate-50 text-ui-dark shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                }
                                value={filtroPeriodo}
                                onChange={(e) => setFiltroPeriodo(e.target.value)}
                            >
                                <option value="">Todos os Períodos</option>
                                {periodos.map(per => (
                                    <option key={per} value={per} className="bg-white text-slate-700">{per}º Período</option>
                                ))}
                            </select>
                        </div>

                        {/* Container da Busca */}
                        <div className="w-full md:w-96 relative">
                            {/* ✨ O ÍCONE DE LUPA: Fica posicionado de forma absoluta por cima do input */}
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-ui-muted"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>

                            {/* ✨ O INPUT: Ganhando um recuo extra na esquerda (pl-10) para o texto não atropelar a lupa */}
                            <input
                                type="text"
                                placeholder="Buscar disciplinas ou códigos..."
                                value={buscaTexto}
                                onChange={(e) => setBuscaTexto(e.target.value)}
                                className="w-full border border-ui-border rounded-full py-2 pl-10 pr-3 text-ui-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-ui-muted text-sm shadow-sm"
                            />
                        </div>
                    </div>

                                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {disciplinasFiltradas.map((materia) => (
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