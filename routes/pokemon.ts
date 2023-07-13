import express from 'express';
import { db } from '../utils/database';
import { customStringify } from '../utils/jsonParser';
const router: express.Router = express.Router();

router.get("/get-all", async (req: express.Request, res: express.Response) => {
    const result = await db?.pokemon.findMany();
    res.json(result).status(200);
})

router.post("/create", async (req: express.Request, res: express.Response) => {
    const result = await db?.pokemon.create({
        data: {
            weight: 0,
            gif: "",
            height: 0,
            base_experience: 0,
            id: 0,
            identifier: "",
            image: ""
        }
    }).catch(err => {
        res.json(err).status(500);
    });

    res.json(result).status(200);
})

router.delete("/delete/:id", async (req: express.Request, res: express.Response) => {
    const id: number = parseInt(req.params.id);
    if (id == null || isNaN(id)) {
        res.status(400).send();
        return;
    }

    return await db?.pokemon.delete({ where: { id: id } }).then((result => {
        res.json({message: "The record was deleted successfully"}).status(200);
    })).catch(err => {
        res.json(err).status(500);
    });
})

export default router;