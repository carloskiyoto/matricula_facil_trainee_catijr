import { Disciplina } from '../types'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface DisciplinaCardProps {
    disciplina: Disciplina
    creditosTotais: number;
    modoMinhasMaterias?: boolean
    onMatriculaSucesso?: (creditos: number) => void
    onCancelamentoSucesso?: (creditos: number) => void
}

export default function DisciplinaCard({ disciplina, creditosTotais, onMatriculaSucesso, onCancelamentoSucesso, modoMinhasMaterias }: DisciplinaCardProps) {
    const navigate = useNavigate();

    // Cor do Status de Pré-requisito
    const corStatus = disciplina.statusPreRequisito
        ? 'text-green-600 bg-green-50'
        : 'text-red-600 bg-red-50'

    const [matriculado, setMatriculado] = useState(disciplina.matriculada || false)

    useEffect(() => {
        setMatriculado(disciplina.matriculada || false)
    }, [disciplina.matriculada])

    async function realizarMatricula() {
        const alunoId = localStorage.getItem('alunoId');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8080/alunos/${alunoId}/matricular/${disciplina.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setMatriculado(true);
                if (onMatriculaSucesso) {
                    onMatriculaSucesso(disciplina.creditos);
                }
            }
        } catch (error) {
            console.error(error);
            alert("Não foi possível conectar ao servidor.");
        }
    }

    async function cancelarMatricula() {
        const alunoId = localStorage.getItem('alunoId');
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/alunos/${alunoId}/desmatricular/${disciplina.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setMatriculado(false);
                if (onCancelamentoSucesso) {
                    onCancelamentoSucesso(disciplina.creditos);
                }
            } else {
                const erroText = await response.text();
                alert(`Erro: ${erroText}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function handleCliqueBotao() {
        if (matriculado) {
            cancelarMatricula();
        } else {
            realizarMatricula();
        }
    }

    const estouraLimite = (creditosTotais + disciplina.creditos) > 24 && !matriculado;

    // botao
    let buttonText = 'Matricular'
    let isBotaoDesativado = false
    let classesDoBotao = 'bg-brand-primary text-white hover:bg-indigo-700'

    // se esta como aprovado, bloqueia a matricula
    if (disciplina.statusConclusao === 'Aprovado') {
        buttonText = 'Disciplina Concluída'
        isBotaoDesativado = true
        classesDoBotao = 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
    }
    // se falta pre req bloqueia
    else if (disciplina.statusPreRequisito === false) {
        buttonText = 'Sem pré-requisito'
        isBotaoDesativado = true
        classesDoBotao = 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }
    //
    else if (matriculado) {
        buttonText = 'Matriculado (Cancelar)'
        isBotaoDesativado = false
        classesDoBotao = 'bg-green-500 text-white hover:bg-red-500'
    }
    // se acabaram as vagas, bloqueia
    else if (disciplina.vagas <= 0) {
        buttonText = 'Vagas esgotadas'
        isBotaoDesativado = true
        classesDoBotao = 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }
    // se passa dos 24 creditos, bloqueia
    else if (estouraLimite) {
        buttonText = 'Limite de créditos excedido'
        isBotaoDesativado = true
        classesDoBotao = 'bg-amber-500 text-white cursor-not-allowed'
    }

    return (
        <div className="bg-white border border-ui-border rounded-xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-ui-dark">{disciplina.nome}</h3>
                    <span className="text-sm text-ui-muted font-medium">{disciplina.codigo}</span>
                </div>


                <div className="flex flex-col items-end gap-1">


                    {disciplina.statusConclusao !== 'Aprovado' && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${corStatus}`}>
                            {disciplina.statusPreRequisito ? "Disponível" : "Bloqueado"}
                        </span>
                    )}

                    {/* falta pré-requisitos */}
                    {!disciplina.statusPreRequisito && disciplina.codigosPreRequisitos && disciplina.codigosPreRequisitos.length > 0 && (
                        <span className="text-[11px] text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-100">
                            Falta: {disciplina.codigosPreRequisitos.join(', ')}
                        </span>
                    )}

                    {/* aprovado ou reprovado */}
                    {disciplina.statusConclusao && (
                        <div className={`mt-1 flex items-center px-2 py-0.5 rounded border text-[11px] font-semibold ${
                            disciplina.statusConclusao === 'Aprovado'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                            {disciplina.statusConclusao === 'Aprovado' ? (
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            ) : (
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            )}
                            {disciplina.statusConclusao === 'Reprovado' ? 'Reprovado anteriormente' : disciplina.statusConclusao}
                        </div>
                    )}

                </div>
            </div>

            <div className="flex flex-col gap-1 text-sm text-ui-medium mt-2">
                <p>📚 {disciplina.creditos} Créditos</p>
                <p>🕒 {disciplina.horario}</p>
                <p>👥 {disciplina.vagas} vagas disponíveis</p>
            </div>

            {modoMinhasMaterias ? (
                <div className="mt-auto flex gap-2">
                    <button
                        onClick={() => navigate(`/detalhes/${disciplina.id}`)}
                        className="flex-1 py-2 rounded-lg font-medium text-sm transition-colors bg-brand-light text-brand-primary hover:bg-indigo-100 border border-brand-light"
                    >
                        Ver Detalhes
                    </button>
                    <button
                        onClick={handleCliqueBotao}
                        disabled={isBotaoDesativado}
                        className="flex-1 py-2 rounded-lg font-medium text-sm transition-colors bg-red-500 text-white hover:bg-red-600"
                    >
                        Cancelar
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleCliqueBotao}
                    disabled={isBotaoDesativado}
                    className={`mt-auto w-full py-2 rounded-lg font-medium transition-colors ${classesDoBotao}`}
                >
                    {buttonText}
                </button>
            )}
        </div>
    )
}