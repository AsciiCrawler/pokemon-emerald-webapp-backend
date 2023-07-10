import express from 'express';
import { db } from '../utils/database';
import { customStringify } from '../utils/jsonParser';
const router: express.Router = express.Router();

router.use("/get-all", async (req: express.Request, res: express.Response) => {
    const result = await db?.pokemon.findMany();
    res.json(result).status(200);
})

export default router;