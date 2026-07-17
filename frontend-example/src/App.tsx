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
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [creditosTotais, setCreditosTotais] = useState(0)

  useEffect(() => {
    async function carregarDadosIniciais() {
      // Pega as credenciais guardadas no login
      const token = localStorage.getItem('token');
      const alunoId = localStorage.getItem('alunoId') || 1;

      if (!token) {
          console.warn("Usuário não autenticado.");
          return;
      }

      try {
        //Faz o fetch usando o ID e o Token
        const resposta = await fetch(`http://localhost:8080/alunos/${alunoId}/disciplinas`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // crachá para o Java liberar o acesso
          }
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          setDisciplinas(dados);

          //calcula os créditos iniciais baseados nos dados que vieram do banco
          const iniciais = dados
            .filter((m: Disciplina) => m.matriculada)
            .reduce((soma: number, m: Disciplina) => soma + m.creditos, 0);

          setCreditosTotais(iniciais);
        } else {
          console.error("Erro ao carregar: Status", resposta.status);
        }
      } catch (erro) {
        console.error("Erro na conexão com o servidor:", erro);
      }
    }

    carregarDadosIniciais();
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<SignupWrapper />} />


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