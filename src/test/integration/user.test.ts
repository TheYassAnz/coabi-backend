import request from "supertest";
import app from "../../app";

describe("User API Integration Tests", () => {
  let userId = "";

  afterAll(async () => {
    await request(app)
      .delete(`/api/users/${userId}`)
      .catch(() => {});
  });

  test("POST /auth/register should create a new user", async () => {
    const userData = {
      username: "jojo",
      password: "password1234",
      email: "jojo@example.com",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    response.body;
    expect(response.body).toHaveProperty("username", "jojo");
    userId = response.body._id;
  });

  test("POST /register should return 400 if required fields are missing", async () => {
    const invalidUserData = {
      email: "jojo@example.com",
      phoneNumber: "1234567890",
    };

    const response = await request(app)
      .post("/api/tasks")
      .send(invalidUserData)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Bad request");
  });

  test("GET /users should return all users", async () => {
    const response = await request(app).get("/api/users").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /users/:id should return a user by ID", async () => {
    const response = await request(app).get(`/api/users/${userId}`).expect(200);
    response.body;
    expect(response.body).toHaveProperty("_id", userId);
  });

  test("PATCH /users/:id should update a user by ID", async () => {
    const updatedData = {
      firstName: "Jojo",
      lastName: "Joestar",
      age: 28,
      description: "Updated test user",
    };

    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send(updatedData)
      .expect(200);

    response.body;
    expect(response.body).toHaveProperty("_id", userId);
    expect(response.body).toHaveProperty("firstName", "Jojo");
  });

  test("PATCH /users/password/:id should update a user password by ID", async () => {
    const updatedData = {
      currentPassword: "password1234",
      newPassword: "password12345",
    };

    const response = await request(app)
      .patch(`/api/users/password/${userId}`)
      .send(updatedData)
      .expect(200);

    response.body;
    expect(response.body).toHaveProperty("_id", userId);
    expect(response.body).toHaveProperty("firstName", "Jojo");
  });

  test("GET /users/filter should return tasks by filter", async () => {
    const params = {
      name: "Jo",
    };

    const response = await request(app)
      .get("/api/users/filter")
      .query(params)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("DELETE /users/:id should delete a user by ID", async () => {
    await request(app).delete(`/api/users/${userId}`).expect(204);

    await request(app).get(`/api/users/${userId}`).expect(404);
  });
});

export default {};
