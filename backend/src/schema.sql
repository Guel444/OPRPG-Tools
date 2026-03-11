-- ============================================================
-- OPRPG TOOLS — Schema do Banco de Dados
-- PostgreSQL
-- ============================================================

-- EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USUÁRIOS
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  is_subscriber BOOLEAN DEFAULT FALSE,  -- acesso aos Arquivos Secretos
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- PERSONAGENS
-- ============================================================
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  player_name VARCHAR(100),
  nex INTEGER DEFAULT 5 CHECK (nex >= 5 AND nex <= 99),
  class VARCHAR(20) NOT NULL CHECK (class IN ('combatente','especialista','ocultista','sobrevivente')),
  subclass VARCHAR(50),  -- trilha
  origin VARCHAR(50),

  -- Atributos
  agi INTEGER DEFAULT 1 CHECK (agi >= 0 AND agi <= 5),
  for_ INTEGER DEFAULT 1 CHECK (for_ >= 0 AND for_ <= 5),
  int_ INTEGER DEFAULT 1 CHECK (int_ >= 0 AND int_ <= 5),
  pre INTEGER DEFAULT 1 CHECK (pre >= 0 AND pre <= 5),
  vig INTEGER DEFAULT 1 CHECK (vig >= 0 AND vig <= 5),

  -- Derivadas (calculadas, salvas para performance)
  pv_max INTEGER,
  pv_atual INTEGER,
  pe_max INTEGER,
  pe_atual INTEGER,
  san_max INTEGER,
  san_atual INTEGER,
  defesa INTEGER,
  prestige INTEGER DEFAULT 0,

  -- Perícias (JSON: {pericia: nivel}) nivel: 0=leigo,1=treinado,2=veterano,3=expert
  skills JSONB DEFAULT '{}',

  -- Poderes e Rituais (arrays de IDs/slugs)
  powers JSONB DEFAULT '[]',
  rituals JSONB DEFAULT '[]',

  -- Equipamentos (JSON com itens e quantidades)
  equipment JSONB DEFAULT '[]',

  -- Condições ativas
  conditions JSONB DEFAULT '[]',

  -- Anotações livres
  notes TEXT,
  backstory TEXT,

  -- Metadados
  is_public BOOLEAN DEFAULT FALSE,
  share_token VARCHAR(32) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- CATÁLOGO — CRIATURAS
-- (dados estáticos, populados por seed)
-- ============================================================
CREATE TABLE creatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  element VARCHAR(20) CHECK (element IN ('sangue','morte','conhecimento','energia','medo','nenhum')),
  vd INTEGER NOT NULL,
  size VARCHAR(20) CHECK (size IN ('minúsculo','pequeno','médio','grande','enorme','colossal')),
  creature_type VARCHAR(20) CHECK (creature_type IN ('criatura','animal','pessoa','ameaça')),

  -- Atributos
  agi INTEGER, for_ INTEGER, int_ INTEGER, pre INTEGER, vig INTEGER,

  -- Derivadas
  pv INTEGER,
  pv_machucado INTEGER,
  defesa INTEGER,
  fort VARCHAR(20),
  reflex VARCHAR(20),
  vontade VARCHAR(20),
  movement INTEGER,
  movement_alt JSONB,  -- {tipo: 'voo', valor: 15}

  -- Presença Perturbadora
  pp_dt INTEGER,
  pp_damage VARCHAR(20),
  pp_immunity_nex INTEGER,

  -- Resistências e vulnerabilidades
  resistances JSONB DEFAULT '{}',
  vulnerabilities JSONB DEFAULT '[]',
  immunities JSONB DEFAULT '[]',

  -- Ações (array de objetos)
  actions JSONB DEFAULT '[]',

  -- Habilidades passivas
  passives JSONB DEFAULT '[]',

  -- Fonte
  source VARCHAR(50) NOT NULL,  -- 'livro_base', 'sah', 'as_jan', 'as_fev'
  is_secret BOOLEAN DEFAULT FALSE,  -- conteúdo dos Arquivos Secretos

  lore TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- CATÁLOGO — RITUAIS
-- ============================================================
CREATE TABLE rituals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  element VARCHAR(20) NOT NULL,
  element_secondary VARCHAR(20),  -- rituais multi-elemento
  circle INTEGER CHECK (circle >= 1 AND circle <= 4),

  -- Mecânica
  execution VARCHAR(30),  -- 'padrão','movimento','completa','livre','reação'
  range VARCHAR(30),
  target VARCHAR(100),
  duration VARCHAR(100),
  resistance VARCHAR(100),
  pe_cost INTEGER,

  description TEXT NOT NULL,
  discente_cost INTEGER,
  discente_description TEXT,
  verdadeiro_cost INTEGER,
  verdadeiro_description TEXT,
  verdadeiro_circle_required INTEGER,

  source VARCHAR(50) NOT NULL,
  is_secret BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- CATÁLOGO — ITENS
-- ============================================================
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  item_type VARCHAR(30) CHECK (item_type IN (
    'arma_simples','arma_tatica','arma_pesada',
    'protecao_leve','protecao_pesada',
    'item_geral','item_paranormal','item_amaldicoado','recurso'
  )),
  element VARCHAR(20),  -- para amaldiçoados
  curse_category INTEGER CHECK (curse_category >= 1 AND curse_category <= 6),
  spaces INTEGER DEFAULT 1,

  -- Para armas
  damage VARCHAR(50),
  damage_type VARCHAR(20),
  critical VARCHAR(20),
  range_type VARCHAR(20),
  hands INTEGER,

  -- Para proteções
  defense_bonus INTEGER,

  description TEXT NOT NULL,
  special_rules JSONB DEFAULT '[]',

  prestige_required INTEGER DEFAULT 0,
  source VARCHAR(50) NOT NULL,
  is_secret BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- CATÁLOGO — PODERES
-- ============================================================
CREATE TABLE powers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  power_type VARCHAR(30) CHECK (power_type IN (
    'geral','combatente','especialista','ocultista','sobrevivente',
    'paranormal_sangue','paranormal_morte','paranormal_conhecimento',
    'paranormal_energia','paranormal_medo','intencao'
  )),
  subclass VARCHAR(50),  -- trilha específica se aplicável

  nex_required INTEGER DEFAULT 5,
  prerequisites JSONB DEFAULT '[]',  -- [{tipo: 'atributo', atributo: 'for', valor: 2}]

  description TEXT NOT NULL,
  affinity_description TEXT,  -- texto da afinidade quando existe

  source VARCHAR(50) NOT NULL,
  is_secret BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- CATÁLOGO — ORIGENS
-- ============================================================
CREATE TABLE origins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  skills_granted JSONB DEFAULT '[]',  -- perícias concedidas
  power_granted VARCHAR(100),          -- poder concedido
  source VARCHAR(50) NOT NULL,
  is_secret BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_share_token ON characters(share_token);
CREATE INDEX idx_creatures_element ON creatures(element);
CREATE INDEX idx_creatures_vd ON creatures(vd);
CREATE INDEX idx_creatures_source ON creatures(source);
CREATE INDEX idx_rituals_element ON rituals(element);
CREATE INDEX idx_rituals_circle ON rituals(circle);
CREATE INDEX idx_items_type ON items(item_type);
CREATE INDEX idx_items_element ON items(element);
CREATE INDEX idx_powers_type ON powers(power_type);
CREATE INDEX idx_powers_nex ON powers(nex_required);