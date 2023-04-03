import app from "./app";
import supertest from "supertest";
import { prismaMock } from "./lib/prisma/client.mock";
const request = supertest(app);

describe("POST /planets", () => {
    test("Valid Request", async () => {
        const planet = {
            name: "Mercurio",
            moons: 20,
            id: 5,
            description: null,
            updateAt: "2023-03-31T05:29:21.768Z",
        };

        //@ts-ignore
        prismaMock.planets.create.mockResolvedValue(planet);

        const response = await request
            .post("/planets")
            .expect(201)
            .send({
                name: "Nettuno",
                moons: 21,
            })
            .expect("Content-Type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");

        expect(response.body).toEqual(planet);
    });

    test("Invalid Request", async () => {
        const planet = {
            moons: 90,
        };

        const response = await request
            .post("/planets")
            .expect(422)
            .send(planet)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });
});

describe("GET /planets ", () => {
    test("Valid Request", async () => {
        const planets = [
            {
                name: "Venere",
                moons: 10,
                id: 1,
                description: null,
                updateAt: "2023-03-24T00:45:08.174Z",
            },
            {
                name: "Marte",
                moons: 2,
                id: 2,
                description: null,
                updateAt: "2023-03-24T00:45:21.181Z",
            },
            {
                name: "Giove",
                moons: 321,
                id: 3,
                description: null,
                updateAt: "2023-03-24T00:45:21.541Z",
            },
            {
                name: "Terra",
                moons: 63,
                id: 4,
                description: null,
                updateAt: "2023-03-24T02:16:27.881Z",
            },
        ];

        //@ts-ignore
        prismaMock.planets.findMany.mockResolvedValue(planets);

        const response = await request
            .get("/planets")
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");

        expect(response.body).toEqual(planets);
    });
});

describe("GET /planet/:id ", () => {
    test("Valid Request", async () => {
        const planet = {
            name: "Venere",
            moons: 10,
            id: 1,
            description: null,
            updateAt: "2023-03-24T00:45:08.174Z",
        };

        //@ts-ignore
        prismaMock.planets.findUnique.mockResolvedValue(planet);

        const response = await request
            .get("/planet/1")
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");

        expect(response.body).toEqual(planet);
    });

    test("Planets does not exist", async () => {
        //@ts-ignore
        prismaMock.planets.findUnique.mockResolvedValue(null);

        const response = await request
            .get("/planets/23")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /planets/23");
    });

    test("ID NaN", async () => {
        const response = await request
            .get("/planets/23")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /planets/23");
    });
});

describe("PUT /planets/:id", () => {
    test("Valid Request", async () => {
        const planet = {
            name: "Mercurio",
            moons: 20,
            id: 5,
            description: "Bel pianeta",
            updateAt: "2023-03-31T05:29:21.768Z",
        };

        //@ts-ignore
        prismaMock.planets.update.mockResolvedValue(planet);

        const response = await request
            .put("/planets/5")
            .send({
                name: "Nettuno",
                description: "Bel pianeta",
                moons: 21,
            })
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");

        expect(response.body).toEqual(planet);
    });

    test("Invalid Request", async () => {
        const planet = {
            moons: 90,
        };

        const response = await request
            .put("/planets/13")
            .send(planet)
            .expect(422)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });

    test("Planets does not exist", async () => {
        //@ts-ignore
        prismaMock.planets.update.mockRejectedValue(new Error("Error"));

        const response = await request
            .put("/planets/23")
            .send({
                name: "Nettuno",
                moons: 20,
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /planets/23");
    });

    test("ID NaN", async () => {
        const response = await request
            .put("/planets/ssdf")
            .send({
                name: "Mercurio",
                moons: 20,
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /planets/ssdf");
    });
});

describe("DELETE /planets/:id ", () => {
    test("Valid Request", async () => {
        const response = await request.delete("/planets/1").expect(204);

        expect(response.text).toEqual("");
    });

    test("Planets does not exist", async () => {
        //@ts-ignore
        prismaMock.planets.delete.mockRejectedValue(new Error("Error"));

        const response = await request
            .delete("/planets/23")
            .expect(404)
            .expect("Content-Type", /text\/html/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");

        expect(response.text).toContain("Cannot DELETE /planets/23");
    });

    test("ID NaN", async () => {
        const response = await request
            .delete("/planets/ewe")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot DELETE /planets/ewe");
    });
});

describe("POST planets/:id/photo", () => {
    test("Valid request with PNG photos", async () => {
        await request
            .post("/planets/21/photo")
            .attach("photo", "test-fixtures/photos/file.png")
            .expect(201)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");
    });

    test("Invalid PLanet ID", async () => {
        const response = await request
            .post("/planets/asd/photo")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot POST /planets/asd/photo");
    });

    test("Invalid Request with no file photo uploaded", async () => {
        const response = await request
            .post("/planets/21/photo")
            .expect(400)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("No photo file uploaded");
    });
});
