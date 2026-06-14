import { FormEvent, useState } from 'react'
import { GraduationCapIcon, EmailIcon, LockIcon, ArrowRightIcon } from '../assets/icons'
import InputField from './InputField'
import { Page } from '../types'

interface LoginCardProps {
  onNavigate?: (page: Page) => void
}

export default function LoginCard({ onNavigate }: LoginCardProps) {
  // 1. Criamos memórias para guardar o email, a senha e as mensagens de erro
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  // 2. A função que acontece quando clicamos em "Entrar"
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // Evita que a página recarregue
    setErro('') // Limpa erros antigos

    try {
      // 3. Chamamos o "Carteiro" para bater na porta do Java
      const resposta = await fetch('http://localhost:8080/alunos/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Avisamos que estamos mandando um papel no formato JSON
        },
        // 4. Montamos o JSON exatamente igual fazíamos no Insomnia!
        body: JSON.stringify({
          email: email,
          senha: senha
        })
      })

      // 5. O que a Recepcionista do Java respondeu?
      if (resposta.ok) { // É um código 200 OK?
        // Deu certo! Navega pro Dashboard!
        onNavigate?.('dashboard')
      } else {
        // Deu código 401 (Unauthorized)
        setErro('E-mail ou senha incorretos.')
      }
    } catch (error) {
      // Erro de rede (se o Java estiver desligado, por exemplo)
      setErro('Erro ao conectar ao servidor. O back-end está rodando?')
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

          {/* 6. Conectamos os Inputs com a memória do React! */}
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