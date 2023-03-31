import { PrismaClient } from "@prisma/client";
import Express from "express";
import "express-async-errors";


const app= Express();
const prisma = new PrismaClient();
app.use(Express.json())                     //Serve per consentire effettivamente di aggiungere il corpo quando fai la richiesta POST.

app.get("/", (req, res) => {
    res.send("Richiesta ricevuta!");
});

app.get("/planets", async (req,res) => {
    const planets = await prisma.planets.findMany();
    res.json(planets);
})


export default app;
