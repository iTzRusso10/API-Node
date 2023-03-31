import app from "./app";
import supertest from "supertest";
import { prismaMock } from "./lib/prisma/client.mock";
const request = supertest(app);

test("GET /planets", async () => {
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
