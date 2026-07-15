import { useParams, useNavigate } from 'react-router-dom'
import DashboardHeader from '../components/DashboardHeader'
import mockUser from '../services/mockUser'
import { Disciplina } from '../types'

interface DetalhesProps {
    disciplinas: Disciplina[]
}

export default function DetalhesDisciplinaPage({ disciplinas }: DetalhesProps) {
    const { id } = useParams(); // Pega o ID que está na URL da página
    const navigate = useNavigate();

    // Procura a matéria específica na lista global que veio do App.tsx
    const disciplina = disciplinas.find(d => d.id === Number(id));

    return (
        <div className="min-h-screen bg-ui-bg">
            <DashboardHeader user={mockUser} />

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Botão de Voltar */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-brand-primary hover:underline font-medium flex items-center gap-1"
                >
                    &larr; Voltar
                </button>

                {!disciplina ? (
                    <p className="text-ui-muted">Disciplina não encontrada ou carregando...</p>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-ui-border p-8">
                        <div className="border-b border-gray-100 pb-6 mb-6">
                            <h2 className="text-3xl font-bold text-ui-dark">{disciplina.nome}</h2>
                            <p className="text-lg text-ui-medium mt-1">Código: {disciplina.codigo}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-bold mb-3 text-gray-700">Informações Gerais</h3>
                                <ul className="space-y-3 text-ui-medium">
                                    <li><strong>📚 Créditos:</strong> {disciplina.creditos}</li>
                                    <li><strong>🕒 Horário:</strong> {disciplina.horario}</li>
                                    <li><strong>👥 Vagas Totais:</strong> {disciplina.vagas}</li>
                                    <li><strong>✨ Status:</strong> {disciplina.matriculada ? 'Cursando' : 'Não matriculado'}</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                                <h3 className="text-lg font-bold mb-3 text-gray-700">Pré-requisitos</h3>
                                {disciplina.codigosPreRequisitos && disciplina.codigosPreRequisitos.length > 0 ? (
                                    <ul className="list-disc list-inside ml-2 text-ui-medium">
                                        {disciplina.codigosPreRequisitos.map(codigo => (
                                            <li key={codigo}>{codigo}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-ui-muted">Esta disciplina não exige pré-requisitos.</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="text-lg font-bold mb-3 text-gray-700">Ementa (Exemplo Geral)</h3>
                            <p className="text-ui-medium leading-relaxed">
                                Não, eu não vou escrever ementa por ementa.
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}