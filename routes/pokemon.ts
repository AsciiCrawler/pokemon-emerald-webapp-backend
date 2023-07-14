import express from 'express';
import { db } from '../utils/database';
import { cache } from '../utils/cache';
import { body, param, validationResult } from 'express-validator';
const router: express.Router = express.Router();

router.get("/get-all", async (req: express.Request, res: express.Response) => {
    const cacheResult = await cache.get("get-all-pokemon");
    if(cacheResult != null) { 
        res.json(cacheResult).status(200);
        return;
    }

    if (db == null) {
        res.json({message: "No database connection"}).status(500);
        return;
    }

    const result = await db.$queryRaw`
        select pokemon.identifier, pokemon.id, pokemon.image, pokemon.gif, types.identifier from pokemon 
        full outer join pokemon_types on (pokemon.id = pokemon_types.pokemon_id)
        full outer join types on (pokemon_types.type_id = types.id);
    `;
    cache.set("get-all-pokemon", result, 0);
    res.json(result).status(200);
})

router.route("/create").post([
    body('id').isInt(),
    body('weight').isInt(),
    body('height').isInt(),
    body('base_experience').isInt(),
    body('gif').isString().isLength({ min: 1, max: 99 }),
    body('identifier').isString().isLength({ min: 1, max: 99 }),
    body('image').isString().isLength({ min: 1, max: 99 }),
], async (req: express.Request, res: express.Response) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400).send(validation.array());
        return;
    }

    const body: {
        id: number,
        weight: number,
        height: number,
        base_experience: number,
        gif: string,
        identifier: string,
        image: string
    } = req.body;

    const result = await db?.pokemon.create({
        data: {
            id: body.id,
            weight: body.weight,
            height: body.height,
            base_experience: body.base_experience,
            gif: body.gif,
            identifier: body.identifier,
            image: body.image
        }
    }).catch(err => {
        res.json(err).status(500);
    });

    res.json(result).status(200);
})

router.route("/delete/:id").delete([param("id").isInt()], async (req: express.Request, res: express.Response) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400).send(validation.array());
        return;
    }

    let id = -1;
    try {
        id = parseInt(req.params.id);
    } catch (error) {
        res.status(400).send(validation.array());
        return;
    }

    return await db?.pokemon.delete({ where: { id: id } }).then((result => {
        res.json({ message: "The record was deleted successfully" }).status(200);
    })).catch(err => {
        res.json(err).status(500);
    });
})

export default router;