const request = require("supertest");
const app = require("../app");

describe("POST /api/auth/login", () => {
  test("should return 200 status code and a token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "mido@gmail.com",
        password: "123456",
      })
      .expect(200);

    // Check that the token property exists on response body
    expect(res.body).toHaveProperty("token");
  });

  test("should return 401 status code if email or password is incorrect", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "mido@gmail.com",
        password: "wrongpassword",
      })
      .expect(401);

    // Check that error.code is INVALID_CREDENTIALS
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });
});
