import Express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";
import {
    validate,
    validationErrorMiddleware,
    planetSchema,
    PlanetDate,
} from "./lib/validation";
import cors from "cors";


const app = Express();
app.use(Express.json()); //Serve per consentire effettivamente di aggiungere il corpo quando fai la richiesta POST.
const corsOpt = {
    origin : "http://localhost:8080"
}
app.use(cors(corsOpt));



app.get("/", (req, res) => {
    res.send("Richiesta ricevuta!");
});

app.get("/planets", async (req, res) => {
    const planets = await prisma.planets.findMany();
    res.json(planets);
});

app.get("/planet/:id(\\d+)", async (req, res, next) => {
    const planetId = Number(req.params.id);
    const planet = await prisma.planets.findUnique({
        where: { id: planetId },
    });

    if (!planet) {
        res.status(404);
        return next(`Cannot GET /planets/${planetId}`);
    }

    res.json(planet);
});

app.post("/planets", validate({ body: planetSchema }), async (req, res) => {
    const planetData: PlanetDate = req.body;
    const planets = await prisma.planets.create({
        data: planetData,
    });

    res.status(201).json(planets);
});

app.put(
    "/planets/:id(\\d+)",
    validate({ body: planetSchema }),
    async (req, res, next) => {
        const planetData: PlanetDate = req.body;
        const planetId = Number(req.params.id);

        try {
            const planet = await prisma.planets.update({
                where: {
                    id: Number(req.params.id),
                },
                data: planetData,
            });

            res.status(200).json(planet);
        } catch (error) {
            res.status(404);
            next(`Cannot PUT /planets/${planetId}`);
        }
    }
);

app.delete(
    "/planets/:id(\\d+)",
    async (req, res, next) => {
        const planetId = Number(req.params.id);

        try {
            await prisma.planets.delete({
                where: {
                    id: planetId,
                },
            });

            res.status(204).end();
        } catch (error) {
            res.status(404);
            next(`Cannot DELETE /planets/${planetId}`);
        }
    }
);

app.use(validationErrorMiddleware);

export default app;
