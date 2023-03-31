import app from "./app";
import supertest from "supertest";
import { prismaMock } from "./lib/prisma/client.mock";
const request = supertest(app);

describe("POST /planets", () => {
    test("Valid Request", async () => {
        const planet = {
            name: "Nettuno",
            moons: 20
        };

        const response = await request
            .post("/planets")
            .expect(201)
            .send(planet)
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

describe("GET /planets ", ()=> {
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
    
})