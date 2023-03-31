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
                name:"Nettuno",
                moons : 21
            })
            .expect("Content-Type", /application\/json/);

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
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(planets);
    });
});

describe("GET /planet/:id ", () => {
    test("Valid Request", async () => {
        const planet = 
            {
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
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(planet);
    });

    test("Planets does not exist", async () => {
        //@ts-ignore
    prismaMock.planets.findUnique.mockResolvedValue(null);

    const response = await request
    .get("/planets/23")
    .expect(404)
    .expect("Content-Type", /text\/html/)

    expect(response.text).toContain("Cannot GET /planets/23")
    })

    test("ID NaN", async () => {

    const response = await request
    .get("/planets/23")
    .expect(404)
    .expect("Content-Type", /text\/html/)

    expect(response.text).toContain("Cannot GET /planets/23")
    })
});
