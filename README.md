# OPRPG Tools 🔴

Ferramentas completas para Ordem Paranormal RPG — fichas automáticas, bestiário, rituais, arsenal e muito mais.

## Stack

| Camada | Tech |
|--------|------|
| Frontend | React 18 + React Router + Tailwind CSS + Framer Motion |
| Backend | Node.js + Express |
| Banco de dados | PostgreSQL |
| Auth | JWT + bcrypt |
| Deploy | Render (recomendado) |

## Módulos

- **Fichas de Personagem** — criação completa com cálculo automático de PV, PE, SAN, Defesa e limite de PE/turno
- **Bestiário** — 50+ criaturas com filtros por elemento, VD, tipo e fonte
- **Rituais** — catálogo completo por elemento e círculo com versões Discente e Verdadeiro
- **Arsenal** — armas, proteções, itens paranormais e amaldiçoados
- **Poderes** — todos os poderes gerais, de classe e paranormais
- **Mesa do Mestre** — geradores, calculadora de VD, tracker de sessão
- **Arquivos Secretos** — conteúdo exclusivo para assinantes (Agatha, Transtornados, Hexatombe, Mascarados)

## Setup Local

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+

### Backend

```bash
cd backend
cp .env.example .env
# Edite .env com suas credenciais de banco
npm install
# Crie o banco e rode o schema:
psql -U postgres -c "CREATE DATABASE oprpg_tools;"
psql -U postgres -d oprpg_tools -f src/schema.sql
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Configure REACT_APP_API_URL=http://localhost:3001/api
npm install
npm start
```

## Estrutura do Projeto

```
oprpg-tools/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # Conexão PostgreSQL
│   │   ├── middleware/auth.js    # JWT + proteção de rotas
│   │   ├── routes/
│   │   │   ├── auth.js           # Login, registro, /me
│   │   │   ├── characters.js     # CRUD de fichas
│   │   │   └── catalog.js        # Criaturas, rituais, itens, poderes
│   │   ├── schema.sql            # Schema completo do banco
│   │   └── index.js              # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/               # Button, Card, Input, Badge, etc.
    │   │   └── layout/           # AppLayout (sidebar + header)
    │   ├── context/
    │   │   └── AuthContext.jsx   # Estado global de autenticação
    │   ├── hooks/
    │   │   └── index.js          # useCatalog, useCharacters, calculateDerived
    │   ├── pages/                # Todas as páginas
    │   ├── styles/
    │   │   └── globals.css       # Design system + variáveis CSS
    │   └── App.jsx               # Roteamento completo
    └── package.json
```

## Sistema de Permissões

| Rota | Público | Logado | Assinante |
|------|---------|--------|-----------|
| Bestiário (base) | ✅ | ✅ | ✅ |
| Bestiário (Arquivos Secretos) | ❌ | ❌ | ✅ |
| Rituais (base) | ✅ | ✅ | ✅ |
| Fichas de Personagem | ❌ | ✅ | ✅ |
| Fichas compartilhadas | ✅ | ✅ | ✅ |
| Mesa do Mestre | ✅ | ✅ | ✅ |
| Arquivos Secretos | ❌ | ❌ | ✅ |

## Deploy no Render

1. Crie um banco PostgreSQL no Render
2. Deploy do backend como Web Service com as variáveis de `.env.example`
3. Deploy do frontend como Static Site com `REACT_APP_API_URL` apontando para o backend
4. Execute o schema SQL via Render Shell ou psql remoto

## Próximos Passos

- [ ] Seed do banco com todo o conteúdo catalogado
- [ ] Página de detalhe de criatura
- [ ] Criação completa de ficha (wizard 9 etapas)
- [ ] Tracker de sessão em tempo real
- [ ] Gerador de missões e NPCs
- [ ] Exportar ficha como PDF
- [ ] Página dos Arquivos Secretos