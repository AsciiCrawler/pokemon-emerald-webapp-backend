CREATE TABLE public.pokemon (
    identifier VARCHAR(100) NOT NULL,
    image VARCHAR(100) NOT NULL,
    gif VARCHAR(100) NOT NULL,
    height INT4 NOT NULL,
    weight INT4 NOT NULL,
    base_experience INT4 NOT NULL,
    id INT4 NOT NULL,
    CONSTRAINT pokemon_pkey PRIMARY KEY (id ASC)
);

CREATE TABLE public.pokemon_types (
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),
    slot INT4 NOT NULL,
    type_id INT4 NOT NULL,
    pokemon_id INT4 NOT NULL,
    rowid INT8 NOT VISIBLE NOT NULL DEFAULT unique_rowid(),
    CONSTRAINT pokemon_types_pkey PRIMARY KEY (rowid ASC)
);

CREATE TABLE public.pokemon_stats (
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),
    pokemon_id INT4 NOT NULL,
    stat_id INT4 NOT NULL,
    base_stat INT4 NOT NULL,
    effort INT4 NOT NULL,
    CONSTRAINT pokemon_pkey PRIMARY KEY (uuid ASC)
);

CREATE TABLE public.stats (
    id INT4 NOT NULL,
    identifier VARCHAR(100) NOT NULL,
    damage_class_id INT4 NOT NULL,
    is_battle_only INT4 NOT NULL,
    game_index INT4 NOT NULL,
    CONSTRAINT stats_pkey PRIMARY KEY (id ASC)
);

CREATE TABLE public.types (
    identifier VARCHAR(100) NOT NULL,
    damage_class_id INT4 NOT NULL,
    id INT4 NOT NULL,
    CONSTRAINT types_pkey PRIMARY KEY (id ASC)
);

CREATE TABLE public.pokemon_abilities (
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),
    pokemon_id INT4 NOT NULL,
    ability_id INT4 NOT NULL,
    is_hidden INT4 NOT NULL,
    slot INT4 NOT NULL,
    CONSTRAINT pokemon_abilities_pkey PRIMARY KEY (uuid ASC)
);

CREATE TABLE public.abilities (
    id INT4 NOT NULL,
    identifier VARCHAR(500) NOT NULL,
    short_effect VARCHAR(500) NOT NULL,
    CONSTRAINT abilities_pkey PRIMARY KEY (id ASC)
);

ALTER TABLE
    public.pokemon_types
ADD
    CONSTRAINT pokemon_types_pokemon_id_fkey FOREIGN KEY (pokemon_id) REFERENCES public.pokemon(id);

ALTER TABLE
    public.pokemon_types VALIDATE CONSTRAINT pokemon_types_pokemon_id_fkey;