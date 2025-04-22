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
      firstName: "John",
      lastName: "Doe",
      username: "JOJOJO",
      password: "password1234",
      age: 30,
      description: "Test user",
      email: "jojojo@example.com",
      phoneNumber: "1234567890",
      profilePictureId: "67e922f5f031d41cd1da4fe4",
      accommodationId: "67e922f5f031d41cd1da4fe4",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty("message", "Ok");
    expect(response.body.data).toHaveProperty("firstName", "John");
    userId = response.body.data._id;
  });

  test("POST /register should return 400 if required fields are missing", async () => {
    const invalidUserData = {
      age: 30,
      description: "Test user",
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
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("GET /users/:id should return a user by ID", async () => {
    const response = await request(app).get(`/api/users/${userId}`).expect(200);
    expect(response.body).toHaveProperty("message", "Ok");
    expect(response.body.data).toHaveProperty("_id", userId);
  });

  test("GET /users/filter should return tasks by filter", async () => {
    const params = {
      name: "Jo",
    };

    const response = await request(app)
      .get("/api/users/filter")
      .query(params)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test("PUT /users/:id should update a user by ID", async () => {
    const updatedData = {
      firstName: "Jane",
      age: 28,
      description: "Updated test user",
    };

    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toHaveProperty("message", "Ok");
    expect(response.body.data).toHaveProperty("_id", userId);
    expect(response.body.data).toHaveProperty("firstName", "Jane");
  });

  test("DELETE /users/:id should delete a user by ID", async () => {
    await request(app).delete(`/api/users/${userId}`).expect(204);

    await request(app).get(`/api/users/${userId}`).expect(404);
  });
});

export default {};
