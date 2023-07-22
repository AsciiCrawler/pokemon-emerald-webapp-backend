import express from 'express';
import { db } from '../utils/postgres';
import { getAllMinimal, getById } from '../models/pokemon';
import { body, param, validationResult } from 'express-validator';
const router: express.Router = express.Router();

router.get("/get-all", async (req: express.Request, res: express.Response) => {
    try {
        const result: any = await getAllMinimal();
        res.json(result).status(200);
    } catch (error) {
        res.json(error).status(500);
    }
});

router.route("/get/:id").get([param("id").isInt()], async (req: express.Request, res: express.Response) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400).send(validation.array());
        return;
    }

    try {
        const id: number = parseInt(req.params.id);
        const pokemon = await getById(id);
        res.json(pokemon).status(200);
    } catch (error) {
        res.json(error).status(500);
    }
});

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

    if (db == null) {
        res.status(500).send("No database connection");
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

    try {
        const result = await db.query(`INSERT INTO pokemon (id, weight, height, base_experience, gif, identifier, image) VALUES ($1,$2,$3,$4,$5,$6,$7);`, [
            body.id, body.weight, body.height, body.base_experience, body.gif, body.identifier, body.image
        ])
        res.json(result.rowCount).status(200);
    } catch (error) {
        res.json(error).status(500);
    }
})

router.route("/delete/:id").delete([param("id").isInt()], async (req: express.Request, res: express.Response) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400).send(validation.array());
        return;
    }

    if (db == null) {
        res.status(500).send("DB Connection doesn't exists");
        return;
    }

    try {
        const id = parseInt(req.params.id);
        const result = await db.query(`DELETE FROM pokemon WHERE id=$1`, [id]);
        res.json(result.rowCount).status(200);
    } catch (error) {
        res.json(error).status(500);
    }
})

export default router;