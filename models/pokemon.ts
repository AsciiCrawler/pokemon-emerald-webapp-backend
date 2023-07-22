import { db } from "../utils/postgres";
import { cache } from '../utils/cache';
import { CACHE_GET_ALL_POKEMON, CACHE_GET_ALL_POKEMON_MINIMAL } from "../utils/const";

interface ISqlResult {
    id: number,                 // Static - No Array
    pokemon_identifier: string, // Static - No Array
    image: string,              // Static - No Array
    gif: string,                // Static - No Array
    stat_id: number,            // Stats - Array[]
    base_stat: number,          // Stats - Array[]
    stat_identifier: string,    // Stats - Array[]
    type_identifier: string,    // Type - Array[]
    abilitie_id: number,
    abilitie_identifier: string // Abilities - Array[]
    abilitie_short_effect: string
};

export const getAll = async () => {
    const cacheResult = await cache.get(CACHE_GET_ALL_POKEMON);
    if (cacheResult != null)
        return cacheResult;

    if (db == null)
        throw new Error("No database Connection");

    const resultJson: any = {};
    {
        const result = await db.query(`
        select 
        pokemon.id, pokemon.identifier as pokemon_identifier, pokemon.image, pokemon.gif,
        pokemon_stats.stat_id, pokemon_stats.base_stat, 
        stats.identifier as stat_identifier,
        types.identifier as type_identifier,
        abilities.id as abilitie_id, abilities.identifier as abilitie_identifier, abilities.short_effect as abilitie_short_effect
        from pokemon 
        join pokemon_types on (pokemon.id = pokemon_types.pokemon_id)
        join types on (pokemon_types.type_id = types.id)
        join pokemon_stats on (pokemon.id = pokemon_stats.pokemon_id)
        join stats on (pokemon_stats.stat_id = stats.id)
        join pokemon_abilities on (pokemon_abilities.pokemon_id = pokemon.id)
        join abilities on (abilities.id = pokemon_abilities.ability_id);`);
        result.rows.forEach((e: ISqlResult) => {
            if (resultJson[e.id] == null) resultJson[e.id] = [];
            resultJson[e.id].push(e);
        });
    }

    for (const key in resultJson) {
        resultJson[key] = resultJson[key].reduce((arr: any, e: ISqlResult) => {
            if (arr.stats.findIndex((j: any) => j.stat_identifier == e.stat_identifier) == -1)
                arr.stats.push({
                    stat_identifier: e.stat_identifier,
                    base_stat: e.base_stat,
                    stat_id: e.stat_id
                })

            if (arr.type.findIndex((j: any) => j == e.type_identifier) == -1)
                arr.type.push(e.type_identifier)

            if (arr.abilities.findIndex((j: any) => j.abilitie_id == e.abilitie_id) == -1)
                arr.abilities.push({
                    abilitie_id: e.abilitie_id,
                    abilitie_identifier: e.abilitie_identifier,
                    abilitie_short_effect: e.abilitie_short_effect
                })

            return arr;
        }, {
            id: parseInt(key),
            pokemon_identifier: resultJson[key][0].pokemon_identifier,
            image: resultJson[key][0].image,
            gif: resultJson[key][0].gif,
            type: [],
            stats: [],
            abilities: []
        });
    }

    await cache.set(CACHE_GET_ALL_POKEMON, resultJson, 0);
    return resultJson;
}

export const getAllMinimal = async () => {
    const cacheResult = await cache.get(CACHE_GET_ALL_POKEMON_MINIMAL);
    if (cacheResult != null)
        return cacheResult;

    const pokemons = await getAll();
    for (const key in pokemons) {
        pokemons[key] = {
            pokemon_identifier: pokemons[key].pokemon_identifier,
            gif: pokemons[key].gif,
            type: pokemons[key].type,
            id: pokemons[key].id
        };
    }

    await cache.set(CACHE_GET_ALL_POKEMON_MINIMAL, pokemons, 0);
    return pokemons;
}

export const getById = async (key: number | string) => {
    if (typeof key == 'number') key = key.toString();
    let pokemons = await getAll();
    return pokemons[key];
}