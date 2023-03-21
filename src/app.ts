import Express from "express";
import "express-async-errors";

const app = Express();

app.get("/", (req, res) => {
    res.send("Richiesta ricevuta!");
});

app.get("/planets", (req,res) => {
    res.json([{ name: "Mercurio" }, { name: "Marte" }])
})

export default app;
