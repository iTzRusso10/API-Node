import Express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";
import {
    validate,
    validationErrorMiddleware,
    planetSchema,
    PlanetDate,
} from "./lib/validation";


const app = Express();
app.use(Express.json()); //Serve per consentire effettivamente di aggiungere il corpo quando fai la richiesta POST.

app.get("/", (req, res) => {
    res.send("Richiesta ricevuta!");
});

app.get("/planets", async (req, res) => {
    const planets = await prisma.planets.findMany();
    res.json(planets);
});

app.post("/planets", validate({body: planetSchema}), async (req, res) => {
    const planets: PlanetDate= req.body;

    res.status(201).json(planets);
});

app.use(validationErrorMiddleware);

export default app;
