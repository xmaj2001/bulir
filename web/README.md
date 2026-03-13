# 42 Next Human Code - 42 NHC

**42 Next Human Code (42 NHC)** é uma plataforma integrada de aprendizagem de programação, focada em desenvolvimento técnico, prática competitiva e colaboração comunitária.

A plataforma combina treino técnico prático, programação competitiva, ensino estruturado e aprendizagem baseada em erros reais, tudo dentro de um ecossistema com comunidades ativas por módulos.

## 🎯 Objetivos do Projeto

O objetivo principal é criar um ambiente onde o utilizador possa **aprender, praticar, competir e colaborar** em um único lugar.

- **Desenvolvimento Técnico**: Melhorar habilidades de programação e lógica.
- **Precisão e Velocidade**: Aprimorar a digitação técnica e precisão de código.
- **Pensamento Algorítmico**: Estimular a resolução de problemas complexos.
- **Competição Saudável**: Promover o crescimento através de desafios e rankings.
- **Aprendizagem Colaborativa**: Incentivar a troca de conhecimento na comunidade.

---

## 🏗️ Arquitetura e Stack Técnica

O backend foi desenhado seguindo princípios de escalabilidade e segurança, utilizando uma arquitetura de monorepo.

### Tecnologias Core

- **Framework**: [NestJS](https://nestjs.com/) (Node.js) - Modular e escalável.
- **Base de Dados**: [PostgreSQL](https://www.postgresql.org/) - Robusta e relacional.
- **ORM**: [Prisma](https://www.prisma.io/) - Tipagem forte e migrações seguras.
- **Cache & Filas**: [Redis](https://redis.io/) - Performance extrema para cache e locks.
- **Jobs Assíncronos**: [BullMQ](https://docs.bullmq.io/) - Gestão de filas para tarefas pesadas.
- **Real-time**: [WebSockets (Socket.io)](https://socket.io/) - Atualizações instantâneas.

### Componentes Especializados

- **Worker Service**: Processa submissões e tarefas pesadas fora da thread principal da API.
- **Judge Service**: Sandbox isolada para execução segura de código submetido, evitando vulnerabilidades de execução remota (RCE).
- **Docker**: Containerização de todos os serviços (api, worker, judge, redis, postgres) para consistência entre ambientes.

---

## 🎮 Módulos da Plataforma

A plataforma está dividida em módulos especializados, cada um com a sua própria progressão.

### 1. ⌨️ Typing Code

Treino de velocidade e precisão de digitação com conteúdos técnicos, algoritmos e até citações de animes.

- **Métricas**: WPM, Accuracy, erro por tecla, tempo de reação.
- **Categorias**: Programação (Frases/Conceitos), Anime, Funções e Algoritmos.

### 2. 🏆 Programação Competitiva

Desafios de algoritmos inspirados em plataformas como LeetCode.

- **Domínios**: Lógica, IA, Estruturas de Dados, etc.
- **Submissão**: Pipeline de validação com múltiplos casos de teste.
- **XP Dinâmico**: Recompensas baseadas na eficiência e tempo de resolução.

### 3. 📚 Learn Programming

Ensino estruturado de conceitos, linguagens e boas práticas, focado na clareza e qualidade do código.

### 4. 🐞 Learning from Bugs

Comunidade colaborativa focada em resolver e documentar erros reais, transformando problemas comuns em lições técnicas.

---

## 📈 Sistema de Progressão e Ranking

Cada utilizador possui um progresso independente por módulo.

### Ranks por Nível

| Rank    | Nível    | Título            |
| ------- | -------- | ----------------- |
| Rank 1  | 91 - 100 | Arquiteto Supremo |
| Rank 2  | 81 - 90  | Mestre            |
| Rank 3  | 71 - 80  | Especialista      |
| Rank 4  | 61 - 70  | Competidor        |
| Rank 5  | 51 - 60  | Estrategista      |
| Rank 6  | 41 - 50  | Desafiador        |
| Rank 7  | 31 - 40  | Programador       |
| Rank 8  | 21 - 30  | Aprendiz          |
| Rank 9  | 11 - 20  | Explorador        |
| Rank 10 | 1 - 10   | Novato            |

**Curva de XP**: A progressão não é linear, utilizando a fórmula `XP = 100 * (nível ^ 1.2)` para manter o desafio constante.

---

## 🌐 API — Pontos de Entrada (Endpoints)

> [!NOTE]
> **Convenção de Autenticação**
>
> - **Público**: Sem autenticação necessária.
> - **Privado**: Requer autenticação. O `userId` é obtido da sessão/cookie.

### Módulos e Progresso

- `GET /modules/` (Público) — Listar todos os módulos.
- `GET /modules/:slug` (Público) — Detalhes de um módulo específico.
- `GET /modules/progress` (Privado) — Progresso global do utilizador.
- `GET /modules/:slug/progress` (Privado) — Progresso detalhado num módulo.

### Typing Code

- `GET /typing-challenges` (Privado) — Listar categorias e dificuldades.
- `POST /typing-challenges/:id/request` (Privado) — Iniciar uma nova sessão de desafio.
- `POST /typing-sessions/:sessionId/complete` (Privado) — Finalizar sessão e enviar métricas.
- `GET /typing-stats/global` (Privado) — Estatísticas acumuladas por tecla.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Docker & Docker Compose
- Node.js (v20+)
- NPM/PNPM

### Setup Local

1. Clone o repositório.
2. Configure o ficheiro `.env` baseado no `.env.template`.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Suba os serviços via Docker:
   ```bash
   docker-compose up -d
   ```
5. Execute as migrações da base de dados:
   ```bash
   npx prisma migrate dev
   ```

### Comandos Úteis

- `npm run dev:api`: Inicia a API em modo watch.
- `npm run dev:queue`: Inicia o worker de filas.
- `npm run build`: Compila o projeto.

---

## 📂 Estrutura do Monorepo

```text
├── apps
│   ├── api          # Aplicação NestJS principal
│   └── queue        # Worker para processamento de filas (BullMQ)
├── libs
│   ├── database     # Schema Prisma e conexão DB
│   ├── modules      # Lógica de negócio (Auth, User, etc.)
│   └── shared       # Adaptadores, configs e utilitários comuns
└── prisma           # Migrações e definições de dados
```
