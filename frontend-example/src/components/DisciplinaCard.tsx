import { Disciplina } from '../types'
import { useState, useEffect } from 'react'

interface DisciplinaCardProps {
    disciplina: Disciplina
    creditosTotais: number;
    onMatriculaSucesso?: (creditos: number) => void
    onCancelamentoSucesso?: (creditos: number) => void
}

export default function DisciplinaCard({ disciplina, creditosTotais, onMatriculaSucesso, onCancelamentoSucesso }: DisciplinaCardProps) {
    const corStatus = disciplina.statusPreRequisito
        ? 'text-green-600 bg-green-50'
        : 'text-red-600 bg-red-50'

    const [matriculado, setMatriculado] = useState(disciplina.matriculada || false)

    useEffect(() => {
        setMatriculado(disciplina.matriculada || false)
    }, [disciplina.matriculada])

    async function realizarMatricula() {
        const alunoId = 1;
        try {
            const response = await fetch(`http://localhost:8080/alunos/${alunoId}/matricular/${disciplina.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                setMatriculado(true);
                if (onMatriculaSucesso) {
                    onMatriculaSucesso(disciplina.creditos);
                }
            } else {
            }
        } catch (error) {
            console.error(error);
            alert("Não foi possível conectar ao servidor.");
        }
    }

    async function cancelarMatricula() {
        const alunoId = 1;
        try {
            const response = await fetch(`http://localhost:8080/alunos/${alunoId}/desmatricular/${disciplina.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
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

    const estouraLimite = (creditosTotais + disciplina.creditos) > 20 && !matriculado;

    let buttonText = 'Matricular'
    let isBotaoDesativado = false
    let classesDoBotao = 'bg-brand-primary text-white hover:bg-indigo-700'

    //Matricular e Matriculado (Cancelar)

     if (disciplina.statusPreRequisito === false) {
        buttonText = 'Sem pré-requisito'
        isBotaoDesativado = true
        classesDoBotao = 'bg-gray-300 text-gray-500 cursor-not-allowed'
    } else if (matriculado) {
        buttonText = 'Matriculado (Cancelar)'
        isBotaoDesativado = false // Botão permanece clicável para cancelar
        classesDoBotao = 'bg-green-500 text-white hover:bg-red-500'
    } else if (disciplina.vagas <= 0) {
        buttonText = 'Vagas esgotadas'
        isBotaoDesativado = true
        classesDoBotao = 'bg-gray-300 text-gray-500 cursor-not-allowed'
    } else if (estouraLimite) {
                             buttonText = 'Limite de créditos excedido';
                             isBotaoDesativado = true;
                             classesDoBotao = 'bg-amber-500 text-white cursor-not-allowed'; // Cor âmbar/laranja de alerta
                   }

    return (
        <div className="bg-white border border-ui-border rounded-xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-ui-dark">{disciplina.nome}</h3>
                    <span className="text-sm text-ui-muted font-medium">{disciplina.codigo}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${corStatus}`}>
                      {disciplina.statusPreRequisito ? "Disponível" : "Bloqueado"}
                    </span>
                    {!disciplina.statusPreRequisito && disciplina.codigosPreRequisitos && disciplina.codigosPreRequisitos.length > 0 && (
                        <span className="text-[11px] text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-100">
                            Falta: {disciplina.codigosPreRequisitos.join(', ')}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1 text-sm text-ui-medium mt-2">
                <p>📚 {disciplina.creditos} Créditos</p>
                <p>🕒 {disciplina.horario}</p>
                <p>👥 {disciplina.vagas} vagas disponíveis</p>
            </div>

            <button
                onClick={handleCliqueBotao}
                disabled={isBotaoDesativado}
                className={`mt-2 w-full py-2 rounded-lg font-medium transition-colors ${classesDoBotao}`}
            >
                {buttonText}
            </button>
        </div>
    )
}