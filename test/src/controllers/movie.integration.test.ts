import mongoose from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');
import app from "../../../src/index";
import { Token } from "../../../src/types/type";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

beforeEach(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING as string);
});

afterEach(async () => {
    await mongoose.connection.close();
});

let auth: Token;
/* Testing the API endpoints. */
describe("GET /login", () => {
    it("should login and generate jwt token", async () => {
        const res = await request(app).post("/login").send({ "username": "admin" });
        auth = res.body;
        expect(res.statusCode).toBe(200);
    });
});

describe("GET /movie", () => {
    it("should return all movie", async () => {
        const res = await request(app).get("/movies").send();
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe("POST /movie", () => {
    it("should create a movie", async () => {
        const res = await request(app).post("/movies").set('Authorization', `Bearer ${auth.token}`).send({
            title: "movie 2",
            genre: "drama",
            rating: "7",
            streamingLink: "link"
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe("movie 2");
    });
});

describe("DELETE /movie/:id", () => {
    it("should delete a movie", async () => {
        const res = await request(app).delete(
            "/movies/65ef53f56c664ad9cf7f2935"
        ).set('Authorization', `Bearer ${auth.token}`);
        expect(res.statusCode).toBe(404);
    });
});