import { FormEvent, useState } from 'react'
import { GraduationCapIcon, EmailIcon, LockIcon, ArrowRightIcon } from '../assets/icons'
import InputField from './InputField'
import { Page } from '../types'

interface LoginCardProps {
  onNavigate?: (page: Page) => void
}

export default function LoginCard({ onNavigate }: LoginCardProps) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // Evita que a página recarregue
    setErro('') // Limpa erros antigos

    try {
                // Chama a porta trancada do Java passando o email e a senha digitados
                const response = await fetch('http://localhost:8080/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // verifique se as suas variáveis de estado se chamam 'email' e 'senha' mesmo
                    body: JSON.stringify({ email: email, senha: senha })
                });

                if (response.ok) {
                    // Se o Java aprovar, ele devolve o crachá (token) e os dados do aluno
                    const dados = await response.json();

                    // SALVANDO O CRACHÁ NO NAVEGADOR
                    localStorage.setItem('token', dados.token);
                    localStorage.setItem('alunoId', String(dados.id));
                    localStorage.setItem('alunoNome', dados.nome);
                    localStorage.setItem('alunoEmail', email);

                     window.location.href = '/dashboard';

                } else {
                    // Erro 401 ou 403 (Senha errada)
                    setErro('E-mail ou senha incorretos.')
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
                setErro('Erro ao conectar ao servidor.')
            }
        }


  return (
      <div className="bg-white border border-ui-border rounded-xl drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-8 p-6 sm:p-[33px]">
        <div className="flex flex-col items-center gap-1 w-full">
          <div className="bg-brand-light flex items-center justify-center w-12 py-[10px] rounded-xl">
            <GraduationCapIcon />
          </div>

          <div className="flex flex-col items-center w-full pt-3">
            <h1 className="font-bold text-[30px] text-brand-primary tracking-[-0.6px] leading-[38px] text-center w-full">
              MatriculaFácil
            </h1>
            <p className="text-base text-ui-medium leading-6 text-center">
              Acesse o Portal do Aluno
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>

          {/* Mostra a caixa vermelha de erro se houver algum */}
          {erro && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-200">
                {erro}
              </div>
          )}

          {/* 6. Conecta os Inputs com a memória do React */}
          <InputField
              label="E-mail"
              icon={<EmailIcon />}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
              label="Senha"
              icon={<LockIcon />}
              type="password"
              placeholder="••••••••"
              rightElement="Esqueceu a senha?"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
          />

          <div className="pt-2">
            <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-medium text-sm leading-5 px-4 py-2 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
            >
              Entrar
              <ArrowRightIcon />
            </button>
          </div>
        </form>

        <div className="border-t border-ui-border w-full pt-[25px]">
          <div className="flex items-center justify-center gap-1">
          <span className="text-base text-ui-medium leading-6">
            Não tem uma conta?
          </span>
            <button
                type="button"
                onClick={() => onNavigate?.('signup')}
                className="font-medium text-sm text-brand-primary leading-5 hover:underline"
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
  )
}
