import express, { json } from 'express';
import pokemonRoutes from './controllers/pokemon';
import { connect, disconnect } from './utils/postgres';
import dotenv from "dotenv";
import { Server } from 'http';
import cors from 'cors';
dotenv.config();

const app: express.Application = express();
let server: Server | null = null;
const port: number = 8080;

app.use(cors());
app.use(json());
app.use("/pokemon", pokemonRoutes);

connect().then(() => {
    server = app.listen(port, () => {
        console.log(`Listen on port : ${port}`);
    });

    process.on("SIGINT", async () => {
        if (server != null)
            server.close();
        await disconnect();
    });
});