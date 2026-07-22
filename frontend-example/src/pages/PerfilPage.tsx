import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import fotoAvatar from '../assets/avatar.jpg'

interface PerfilPageProps {
    user: User | any;
}

export default function PerfilPage({ user }: PerfilPageProps) {
    const navigate = useNavigate()

    const [nome, setNome] = useState(user.name)
    const [email, setEmail] = useState(user?.email || '')
    const [periodo, setPeriodo] = useState(user.periodo || '1º Semestre')

    const [notifEmail, setNotifEmail] = useState(true)
    const [notifLembretes, setNotifLembretes] = useState(true)
    const [temaEscuro, setTemaEscuro] = useState(false)
    const [mensagemSucesso, setMensagemSucesso] = useState('')

    function handleSalvar(e: React.FormEvent) {
        e.preventDefault()
        setMensagemSucesso('Configurações salvas com sucesso!')
        setTimeout(() => setMensagemSucesso(''), 3000)
    }

    useEffect(() => {
            if (user) {
                setNome(user.name || 'Aluno');
                setEmail(user.email || '');
                if (user.periodo) setPeriodo(user.periodo);
            }
        }, [user])

    function handleSalvar(e: React.FormEvent) {
        e.preventDefault()
        setMensagemSucesso('Configurações salvas com sucesso!')
        setTimeout(() => setMensagemSucesso(''), 3000)
    }

    return (
        <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">

            {/* Cabeçalho com o botão de Voltar */}
            <header className="border-b border-gray-200 pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Meu Perfil </h1>
                    <p className="text-sm text-gray-500">Gerencie suas informações pessoais e preferências acadêmicas</p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/dashboard')} // Ou navigate(-1) para voltar ao histórico anterior
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-300"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar
                </button>
            </header>

            {mensagemSucesso && (
                <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm font-medium">
                    {mensagemSucesso}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* CARD DE IDENTIFICAÇÃO */}
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center gap-3">

                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={`Foto de ${nome}`}
                                            className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-indigo-100"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-3xl shadow-md">
                                            {nome.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">{nome}</h2>
                                        <p className="text-sm text-gray-500">{email}</p>
                                    </div>
                                    <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100 mt-1">
                                        {periodo} • Engenharia de Computação
                                    </span>
                                </div>

                {/* Form de Configurações */}
                <form onSubmit={handleSalvar} className="md:col-span-2 flex flex-col gap-6">
                    {/* Informações Pessoais */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
                        <h3 className="font-bold text-base text-gray-800 border-b pb-2">Informações Pessoais</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">E-mail Institucional</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferências do Sistema */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
                        <h3 className="font-bold text-base text-gray-800 border-b pb-2">Preferências do Sistema</h3>

                        <div className="flex justify-between items-center py-1">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Notificações por E-mail</p>
                                <p className="text-xs text-gray-500">Receber confirmações de matrícula por e-mail</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={notifEmail}
                                onChange={(e) => setNotifEmail(e.target.checked)}
                                className="w-5 h-5 accent-indigo-600 cursor-pointer"
                            />
                        </div>

                        <div className="flex justify-between items-center py-1 border-t border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Lembrete de Inscrição</p>
                                <p className="text-xs text-gray-500">Avisar quando novas vagas forem liberadas nas matérias</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={notifLembretes}
                                onChange={(e) => setNotifLembretes(e.target.checked)}
                                className="w-5 h-5 accent-indigo-600 cursor-pointer"
                            />
                        </div>

                        <div className="flex justify-between items-center py-1 border-t border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Modo Escuro </p>
                                <p className="text-xs text-gray-500">Alternar tema do painel acadêmico</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={temaEscuro}
                                onChange={(e) => setTemaEscuro(e.target.checked)}
                                className="w-5 h-5 accent-indigo-600 cursor-pointer"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white text-sm font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm self-end"
                    >
                        Salvar Alterações
                    </button>
                </form>
            </div>
        </div>
    )
}