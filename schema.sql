-- PostgreSQL Schema for Regularização Ambiental

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Empresa (Tenant)
CREATE TABLE IF NOT EXISTS empresa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  razao_social VARCHAR(255) NOT NULL,
  cnpj VARCHAR(14) NOT NULL UNIQUE,
  plano VARCHAR(50) NOT NULL DEFAULT 'basic',
  ativo BOOLEAN NOT NULL DEFAULT true,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Usuario
CREATE TABLE IF NOT EXISTS usuario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'administrativo',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(empresa_id, email)
);

-- Cliente
CREATE TABLE IF NOT EXISTS cliente (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  cpf_cnpj VARCHAR(14) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(255),
  score_bant INT DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'lead',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(empresa_id, cpf_cnpj)
);

-- Processo
CREATE TABLE IF NOT EXISTS processo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES cliente(id) ON DELETE CASCADE,
  numero_processo VARCHAR(50) NOT NULL,
  etapa_atual INT NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL DEFAULT 'ativo',
  valor_total NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(empresa_id, numero_processo)
);

-- Imovel
CREATE TABLE IF NOT EXISTS imovel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  processo_id UUID NOT NULL UNIQUE REFERENCES processo(id) ON DELETE CASCADE,
  matricula VARCHAR(50) NOT NULL,
  area_hectares NUMERIC(10, 2) NOT NULL,
  municipio VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Etapa Processo
CREATE TABLE IF NOT EXISTS etapa_processo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  processo_id UUID NOT NULL REFERENCES processo(id) ON DELETE CASCADE,
  numero_etapa INT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'nao_iniciado',
  data_inicio TIMESTAMP,
  data_conclusao TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(processo_id, numero_etapa)
);

-- Documento
CREATE TABLE IF NOT EXISTS documento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  processo_id UUID NOT NULL REFERENCES processo(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL,
  nome_arquivo VARCHAR(255) NOT NULL,
  s3_url VARCHAR(1000) NOT NULL,
  status_validacao VARCHAR(50) NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Pagamento
CREATE TABLE IF NOT EXISTS pagamento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  processo_id UUID NOT NULL REFERENCES processo(id) ON DELETE CASCADE,
  numero_parcela INT NOT NULL,
  valor NUMERIC(12, 2) NOT NULL,
  data_vencimento DATE NOT NULL,
  status_pagamento VARCHAR(50) NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Auditoria
CREATE TABLE IF NOT EXISTS auditoria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  processo_id UUID NOT NULL REFERENCES processo(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuario(id) ON DELETE SET NULL,
  acao VARCHAR(500) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_empresa_cnpj ON empresa(cnpj);
CREATE INDEX idx_usuario_empresa_email ON usuario(empresa_id, email);
CREATE INDEX idx_cliente_empresa_status ON cliente(empresa_id, status);
CREATE INDEX idx_processo_empresa_status ON processo(empresa_id, status);
CREATE INDEX idx_imovel_matricula ON imovel(matricula);
CREATE INDEX idx_documento_processo ON documento(processo_id);
CREATE INDEX idx_pagamento_processo ON pagamento(processo_id);
