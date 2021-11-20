import "../src/setup.js"
import supertest from "supertest";
import app from "../src/app"


describe ("POST/sign-up", () => {

    it("returns 400 invalid body, Empty body", async () => {    
        const result = await supertest(app).post("/sign-up").send({});
        expect(result.status).toEqual(400);
    });
    
})