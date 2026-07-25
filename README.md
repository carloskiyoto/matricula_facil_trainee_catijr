# Matrícula Fácil

## Sobre o Projeto
O **Matrícula Fácil** é uma plataforma web para gestão simplificada de matrículas universitárias. O sistema permite que os alunos visualizem o catálogo de disciplinas, gerenciem suas inscrições e acompanhem seu progresso acadêmico em uma interface limpa e intuitiva. 

A aplicação automatiza validações acadêmicas cruciais, impedindo matrículas em casos de:
- Falta de pré-requisitos exigidos.
- Limite de créditos semestrais ultrapassado.
- Conflitos de horários na grade do aluno.

## Tecnologias Utilizadas
- **Front-end:** React, TypeScript, Tailwind CSS, Framer Motion.
- **Back-end:** Java 17, Spring Boot, Spring Security (JWT), Maven, JPA/Hibernate.
- **Banco de Dados:** PostgreSQL.
- **Infraestrutura/DevOps:** Docker, Docker Compose (Multi-stage build).

## Pré-requisitos
Para rodar este projeto, você precisará ter as seguintes ferramentas instaladas em sua máquina:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) e Docker Compose (ou Docker Desktop para usuários Windows/Mac)
- [Node.js](https://nodejs.org/) e NPM (para o front-end)

## Arquitetura e Configuração Docker
O ambiente foi configurado seguindo padrões profissionais de mercado:
1. **Dockerfile Multi-stage:** O back-end em Java é compilado isoladamente através do Maven em um primeiro estágio, e apenas o artefato gerado (`.jar`) é copiado para uma imagem Alpine (extremamente leve) do Java 17.
2. **Docker Compose:** Orquestra a inicialização do Banco de Dados (`db`) e da API Java (`backend`), garantindo que eles operem na mesma rede e se comuniquem corretamente.

## Como Executar o Projeto

Siga o passo a passo abaixo para levantar o ecossistema completo.

### 1. Clonar o Repositório
```bash
git clone [https://github.com/carloskiyoto/matricula_facil_trainee_catijr.git](https://github.com/carloskiyoto/matricula_facil_trainee_catijr.git)
cd matricula_facil_trainee_catijr
```
### 2. Iniciar o Back-end e Banco de Dados (Docker)
Na raiz do projeto (onde está localizado o arquivo docker-compose.yml), execute o comando abaixo para construir as imagens e subir os contêineres em segundo plano:


```docker compose up -d --build```

Talvez você tenha que aguardar 30/40 segundos depois do conteiner ser criado, use `docker logs matricula_db_container ` até aparecer a mensagem: `database system is ready to accept connections`

### 3. Iniciar o Front-end (Localmente)
Conforme as boas práticas e para maior agilidade no desenvolvimento, o front-end em React é executado localmente.

Abra um novo terminal, entre na pasta do front-end e instale as dependências:

```bash
# Navegue para o diretório do front-end (ajuste o nome se necessário)
cd frontend-example 

# Instale as dependências listadas no package.json
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
Acesse a aplicação pelo navegador na URL informada no terminal (geralmente http://localhost:5173 ou http://localhost:3000).

### Portas Utilizadas
PostgreSQL: 5432 (Mapeada para acesso via DBeaver/pgAdmin, se necessário).

Spring Boot API: 8080 (Consumida pelo front-end).

React Vite: 5173 (ou equivalente).

## Dica de uso
- **Acesse a conta** de um usuário pré-criado, o **Rogério**, para analisar completamente o sistema como se Rogério fosse um veterano
  
**Email:** rogerio@email.com

**Senha:** 123

## Agradecimentos e Motivação

### Motivação
O **Matrícula Fácil** foi um projeto trainee individual da CATI Jr. realizado com o intuito de aprender conceitos de Spring Boot, React, Tailwind CSS, Docker e outros frameworks e APIs

O objetivo principal deste projeto foi construir uma solução (combinando back-end, segurança em transações de dados e uma interface no front-end) aplicando na prática conceitos de engenharia de software, containerização, arquitetura de sistemas e entre outros.




