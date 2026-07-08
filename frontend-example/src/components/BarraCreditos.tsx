interface BarraCreditosProps {
    creditosAtuais: number;
    creditosMaximos: number;
}

export default function BarraCreditos({ creditosAtuais, creditosMaximos }: BarraCreditosProps) {
    const porcentagem = Math.min((creditosAtuais / creditosMaximos) * 100, 100);
    const corBarra = creditosAtuais >= creditosMaximos ? 'bg-red-500' : 'bg-brand-primary';

    return (
        <div className="bg-white border border-ui-border rounded-xl p-5 shadow-sm min-w-[250px] sm:min-w-[300px]">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-ui-dark text-sm">Créditos do Semestre</span>
                <span className="text-sm font-medium text-ui-muted">
                    {creditosAtuais} / {creditosMaximos}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${corBarra}`}
                    style={{ width: `${porcentagem}%` }}
                ></div>
            </div>
        </div>
    );
}