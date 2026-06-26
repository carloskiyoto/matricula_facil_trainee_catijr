import { Disciplina } from '../types'
import { useState } from 'react'

interface DisciplinaCardProps {
    disciplina: Disciplina
}

export default function DisciplinaCard({ disciplina }: DisciplinaCardProps) {
    const corStatus = disciplina.statusPreRequisito
        ? 'text-green-600 bg-green-50'
        : 'text-red-600 bg-red-50'

    const [matriculado, setMatriculado] = useState(false)

    // FUNÇÃO DE MATRICULAR
    async function realizarMatricula() {
        const alunoId = 1;
        try {
            const response = await fetch(`http://localhost:8080/alunos/${alunoId}/matricular/${disciplina.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const mensagem = await response.text();
                setMatriculado(true);
            } else {
                const erroText = await response.text();
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Não foi possível conectar ao servidor.");
        }
    }

    // DELETE
    async function cancelarMatricula() {
        const alunoId = 1;
        try {
            const response = await fetch(`http://localhost:8080/alunos/${alunoId}/desmatricular/${disciplina.id}`, {
                method: 'DELETE', //método DELETE do Spring
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const mensagem = await response.text();
                setMatriculado(false);
            } else {
                const erroText = await response.text();
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Não foi possível conectar ao servidor.");
        }
    }
    function handleCliqueBotao() {
        if (matriculado) {
            cancelarMatricula();
        } else {
            realizarMatricula();
        }
    }

    let buttonText = `Matricular`
    if (disciplina.statusPreRequisito === false){
        buttonText = `Sem pré-requisito`
    } else if (matriculado){
        buttonText = `Matriculado (Cancelar)`
    }

    return (
        <div className="bg-white border border-ui-border rounded-xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-ui-dark">{disciplina.nome}</h3>
                    <span className="text-sm text-ui-muted font-medium">{disciplina.codigo}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${corStatus}`}>
                  {disciplina.statusPreRequisito ? "Disponível" : "Bloqueado"}
                </span>
            </div>

            <div className="flex flex-col gap-1 text-sm text-ui-medium mt-2">
                <p>📚 {disciplina.creditos} Créditos</p>
                <p>🕒 {disciplina.horario}</p>
                <p>👥 {disciplina.vagas} vagas disponíveis</p>
            </div>

            <button
                onClick={handleCliqueBotao}
                disabled={!disciplina.statusPreRequisito}
                className={`mt-2 w-full py-2 rounded-lg font-medium transition-colors ${
                    matriculado
                    ? 'bg-green-500 text-white hover:bg-red-500'
                    : 'bg-brand-primary text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
            >
                {buttonText}
            </button>
        </div>
    )
}