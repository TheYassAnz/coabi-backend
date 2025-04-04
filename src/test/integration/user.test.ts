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
      firstname: "John",
      lastname: "Doe",
      username: "johndoe",
      password: "password123",
      age: 30,
      description: "Test user",
      email: "johndoe@example.com",
      phone_number: "1234567890",
      profile_picture_id: "67e922f5f031d41cd1da4fe4",
      accommodation_id: "67e922f5f031d41cd1da4fe4",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty("user");
    userId = response.body.user._id;
  });

  test("GET /users should return all users", async () => {
    const response = await request(app).get("/api/users").expect(200);
    expect(Array.isArray(response.body.users)).toBe(true);
  });

  test("GET /users/:id should return a user by ID", async () => {
    const response = await request(app).get(`/api/users/${userId}`).expect(200);
    expect(response.body).toHaveProperty("_id", userId);
  });

  test("PUT /users/:id should update a user by ID", async () => {
    const updatedData = {
      firstname: "Jane",
      age: 28,
      description: "Updated test user",
    };

    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toHaveProperty("_id", userId);
  });

  test("DELETE /users/:id should delete a user by ID", async () => {
    const response = await request(app)
      .delete(`/api/users/${userId}`)
      .expect(200);
    expect(response.body).toHaveProperty("message", "OK.");

    await request(app).get(`/api/users/${userId}`).expect(404);
  });
});

export default {};
