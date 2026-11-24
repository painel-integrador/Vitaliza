-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.contas
(
  id                bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  email             character varying                   NOT NULL UNIQUE,
  senha_cripto      character varying,
  criado_em         timestamp with time zone            NOT NULL DEFAULT now(),
  usuario_id        bigint,
  conexao_google_id bigint,
  CONSTRAINT contas_pkey PRIMARY KEY (id),
  CONSTRAINT contas_conexao_google_id_fkey FOREIGN KEY (conexao_google_id) REFERENCES public.conexoes_google (id),
  CONSTRAINT contas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios (id)
);
CREATE TABLE public.sessoes
(
  criado_em               timestamp with time zone            NOT NULL DEFAULT now(),
  access_token            character varying                   NOT NULL,
  access_token_expira_em  timestamp with time zone            NOT NULL,
  endereco_ip             character varying,
  user_agent              character varying,
  id                      bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  conta_id                bigint                              NOT NULL,
  refresh_token           character varying                   NOT NULL,
  refresh_token_expira_em timestamp with time zone            NOT NULL,
  CONSTRAINT sessoes_pkey PRIMARY KEY (id),
  CONSTRAINT sessoes_conta_id_fkey FOREIGN KEY (conta_id) REFERENCES public.contas (id)
);
CREATE TABLE public.conexoes_google
(
  id            bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  criado_em     timestamp with time zone            NOT NULL DEFAULT now(),
  google_id     character varying                   NOT NULL UNIQUE,
  access_token  character varying UNIQUE,
  refresh_token character varying,
  expira_em     timestamp with time zone            NOT NULL,
  CONSTRAINT conexoes_google_pkey PRIMARY KEY (id)
);
CREATE TABLE public.usuarios
(
  id                  bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  criado_em           timestamp with time zone            NOT NULL DEFAULT now(),
  nome                character varying                   NOT NULL,
  idade               smallint,
  altura              smallint,
  peso                bigint,
  grupo               bigint,
  avatar              smallint,
  CONSTRAINT usuarios_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_grupo_fkey FOREIGN KEY (grupo) REFERENCES public.grupos (id)
);
CREATE TABLE public.series
(
  id             bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  numero         smallint,
  reps           smallint,
  peso           smallint,
  treino_id      bigint                              NOT NULL,
  nome_exercicio text                                NOT NULL DEFAULT ''::text,
  midias ARRAY,
  CONSTRAINT series_pkey PRIMARY KEY (id),
  CONSTRAINT series_exercicio_id_fkey FOREIGN KEY (treino_id) REFERENCES public.treinos (id),
  CONSTRAINT series_treino_id_fkey FOREIGN KEY (treino_id) REFERENCES public.treinos (id)
);
CREATE TABLE public.treinos
(
  id         bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  criado_em  timestamp with time zone            NOT NULL DEFAULT now(),
  usuario_id bigint,
  CONSTRAINT treinos_pkey PRIMARY KEY (id),
  CONSTRAINT exercicios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios (id)
);
CREATE TABLE public.registros_hidratacao
(
  id         bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  criado_em  timestamp with time zone            NOT NULL DEFAULT now(),
  quantidade bigint                              NOT NULL,
  usuario_id bigint                              NOT NULL,
  CONSTRAINT registros_hidratacao_pkey PRIMARY KEY (id),
  CONSTRAINT registros_hidratacao_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios (id)
);
CREATE TABLE public.grupos
(
  id        bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  criado_em timestamp with time zone            NOT NULL DEFAULT now(),
  CONSTRAINT grupos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.rotinas
(
  id         bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  criado_em  timestamp with time zone            NOT NULL DEFAULT now(),
  usuario_id bigint,
  nome       text                                NOT NULL,
  CONSTRAINT rotinas_pkey PRIMARY KEY (id),
  CONSTRAINT rotinas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios (id)
);
CREATE TABLE public.exercicios_rotinas
(
  id        bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  rotina_id bigint,
  nome      text                                NOT NULL DEFAULT ''::text,
  midia ARRAY,
  series    smallint,
  CONSTRAINT exercicios_rotinas_pkey PRIMARY KEY (id),
  CONSTRAINT exercicios_rotinas_rotina_id_fkey FOREIGN KEY (rotina_id) REFERENCES public.rotinas (id)
);
CREATE TABLE public.mensagens
(
  id        bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  criado_em timestamp with time zone            NOT NULL DEFAULT now(),
  nome      text                                NOT NULL,
  email     text,
  mensagem  text                                NOT NULL,
  CONSTRAINT mensagens_pkey PRIMARY KEY (id)
);
