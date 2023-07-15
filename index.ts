import express, { json } from 'express';
import pokemonRoutes from './controllers/pokemon';
import { connect } from './utils/postgres';
import dotenv from "dotenv"
dotenv.config();

const app: express.Application = express();
const port: number = 8080;

app.use(json());
app.use("/pokemon", pokemonRoutes);

connect().then(() => {
    app.listen(port, () => {
        console.log(`Listen on port : ${port}`);
    });
});