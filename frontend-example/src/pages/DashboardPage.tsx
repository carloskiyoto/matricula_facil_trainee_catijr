import DashboardHeader from '../components/DashboardHeader'
import mockUser from '../services/mockUser'
import { Disciplina } from "../types"
import DisciplinaCard from "../components/DisciplinaCard"
import BarraCreditos from '../components/BarraCreditos'
import { useState } from 'react'
//menu animado
function FiltroCustomizado({ valor, onChange, opcoes, placeholder }: { valor: string, onChange: (v: string) => void, opcoes: string[], placeholder: string }) {
    const [aberto, setAberto] = useState(false);
    const selecionado = valor === '';

    return (
        <div className="relative w-full sm:w-auto">
            {/* O Botão que o usuário clica */}
            <button
                type="button"
                onClick={() => setAberto(!aberto)}
                onBlur={() => setTimeout(() => setAberto(false), 150)}
                className={`flex items-center justify-between w-full sm:w-48 border rounded-2xl p-2 text-sm shadow-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                    selecionado
                        ? "bg-brand-primary text-white border-transparent hover:bg-indigo-700 hover:shadow-md"
                        : "bg-ui-bg text-ui-dark border-slate-300 hover:bg-slate-100"
                }`}
            >
                <span className="truncate mr-2 font-medium">{valor || placeholder}</span>

                {/* Ícone de setinha que gira suavemente quando abre */}
                <svg className={`w-4 h-4 transition-transform duration-300 ${aberto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* A Lista Animada que cai por cima da tela */}
            <div
                className={`absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl transition-all duration-300 origin-top ${
                    aberto ? "opacity-100 scale-y-100 translate-y-0 visible" : "opacity-0 scale-y-95 -translate-y-2 invisible"
                }`}
            >
                <ul className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <li
                        onClick={() => { onChange(''); setAberto(false); }}
                        className={`p-2 text-sm rounded-xl cursor-pointer transition-colors duration-150 ${selecionado ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        {placeholder}
                    </li>
                    {opcoes.map(opcao => (
                        <li
                            key={opcao}
                            onClick={() => { onChange(opcao); setAberto(false); }}
                            className={`p-2 text-sm rounded-xl cursor-pointer transition-colors duration-150 ${valor === opcao ? 'bg-brand-primary text-white font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            {opcao}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

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
const matchPeriodo = filtroPeriodo === '' || `${materia.periodo}º Período` === filtroPeriodo

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
                            <BarraCreditos creditosAtuais={creditosTotais} creditosMaximos={24} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 md:items-end w-full">

                                        {/* Bloco da Esquerda: Novos Filtros Animados */}
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <FiltroCustomizado
                                                valor={filtroDepartamento}
                                                onChange={setFiltroDepartamento}
                                                opcoes={departamentos}
                                                placeholder="Todos os Departamentos"
                                            />

                                            <FiltroCustomizado
                                                valor={filtroPeriodo}
                                                onChange={setFiltroPeriodo}
                                                opcoes={periodos.map(p => `${p}º Período`)}
                                                placeholder="Todos os Períodos"
                                            />
                                        </div>

                                        {/* Bloco da Direita: Busca com Animação Suave */}
                                        <div className="w-full md:w-96 relative group">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    {/* O Ícone de lupa que muda de cor ao focar */}
                                                    <svg className="w-4 h-4 text-ui-muted transition-colors duration-300 group-focus-within:text-brand-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Buscar disciplinas ou códigos..."
                                                    value={buscaTexto}
                                                    onChange={(e) => setBuscaTexto(e.target.value)}

                                                    className="w-full border border-ui-border rounded-2xl py-2.5 pl-10 pr-3 text-ui-dark bg-white transition-all duration-300 ease-in-out hover:border-slate-400 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary focus:-translate-y-0.5 placeholder:text-ui-muted text-sm shadow-sm"
                                                />
                                            </div>
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