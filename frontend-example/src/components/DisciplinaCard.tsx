import { Disciplina } from '../types'

interface DisciplinaCardProps {
    disciplina: Disciplina
}

export default function DisciplinaCard({ disciplina }: DisciplinaCardProps) {
    // Uma lógica simples: Se estiver bloqueado, a cor do texto muda para vermelho
    const corStatus = disciplina.statusPreRequisito
        ? 'text-green-600 bg-green-50'
        : 'text-red-600 bg-red-50'

    return (
        <div className="bg-white border border-ui-border rounded-xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-ui-dark">{disciplina.nome}</h3>
                    <span className="text-sm text-ui-muted font-medium">{disciplina.codigo}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${corStatus}`}>
          {disciplina.statusPreRequisito}
        </span>
            </div>

            <div className="flex flex-col gap-1 text-sm text-ui-medium mt-2">
                <p>📚 {disciplina.creditos} Créditos</p>
                <p>🕒 {disciplina.horario}</p>
                <p>👥 {disciplina.vagas} vagas disponíveis</p>
            </div>

            <button
                disabled={!disciplina.statusPreRequisito}
                className="mt-2 w-full bg-brand-primary text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Matricular
            </button>
        </div>
    )
}