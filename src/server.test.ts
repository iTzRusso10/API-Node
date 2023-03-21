import app from "./app";
import supertest from "supertest";

const request = supertest(app);

test("GET /planets", async () => {
    const response = await request
        .get("/planets")
        .expect(200)
        .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual([{ name: "Mercurio" }, { name: "Marte" }]);
});
