const request = require("supertest");
const app = require("./App.test.js");

describe("User Registration and Login", () => {
  test("Should register a new user", async () => {
    const response = await request(app).post("/register").send({
      firstname: "John",
      secondname: "Doe",
      username: "john.doe",
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("username", "john.doe");
  });

  test("Should log in an existing user", async () => {
    const response = await request(app).post("/login").send({
      username: "john.doe",
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("username", "john.doe");
  });

  // Add more tests as needed
});
