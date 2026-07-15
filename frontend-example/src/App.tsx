import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import MinhasMateriasPage from './pages/MinhasMateriasPage'
import DetalhesDisciplinaPage from './pages/DetalhesDisciplinaPage'
import { Disciplina } from './types'

function LoginWrapper() {
  const navigate = useNavigate()
  return <LoginPage onNavigate={(page) => navigate(`/${page}`)} />
}

function SignupWrapper() {
  const navigate = useNavigate()
  return <SignupPage onNavigate={(page) => navigate(`/${page}`)} />
}

export default function App() {
  // ✨ Armazenamos as disciplinas e os créditos aqui na raiz para "congelar"
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [creditosTotais, setCreditosTotais] = useState(0)

  // ✨ O fetch SÓ roda no carregamento inicial (ou F5)
  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        const resposta = await fetch('http://localhost:8080/alunos/1/disciplinas')
        if (resposta.ok) {
          const dados = await resposta.json()
          setDisciplinas(dados)

          // Calcula os créditos salvos inicialmente no banco
          const iniciais = dados
            .filter((m: Disciplina) => m.matriculada)
            .reduce((soma: number, m: Disciplina) => soma + m.creditos, 0)
          setCreditosTotais(iniciais)
        }
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro)
      }
    }
    carregarDadosIniciais()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<SignupWrapper />} />

        {/* Passamos o estado fixo e as funções de alteração para as páginas */}
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              disciplinas={disciplinas}
              setDisciplinas={setDisciplinas}
              creditosTotais={creditosTotais}
              setCreditosTotais={setCreditosTotais}
            />
          }
        />
        <Route
          path="/minhas-materias"
          element={
            <MinhasMateriasPage
              disciplinas={disciplinas}
              setDisciplinas={setDisciplinas}
              setCreditosTotais={setCreditosTotais}
            />
          }
        />
        <Route
                  path="/detalhes/:id"
                  element={<DetalhesDisciplinaPage disciplinas={disciplinas} />}
                />
      </Routes>
    </BrowserRouter>
  )
}