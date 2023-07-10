import express from 'express';
import pokemonRoutes from './routes/pokemon';
import { connect as connectDB } from './utils/database';

const app: express.Application = express();
const port: number = 8080;
app.use("/pokemon", pokemonRoutes);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Listen on port : ${port}`);
    });
});