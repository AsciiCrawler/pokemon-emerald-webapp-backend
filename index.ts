import express from 'express';
import pokemonRoutes from './routes/pokemon';
import { connect as connectDB } from './utils/database';

const app: express.Application = express();
const port: number = 8080;

const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
};

app.use("/pokemon", pokemonRoutes);
app.use(errorHandler);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Listen on port : ${port}`);
    });
});