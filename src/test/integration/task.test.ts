import request from "supertest";
import app from "../../app";

describe("Task API Integration Tests", () => {
  let taskId = "";

  afterAll(async () => {
    await request(app)
      .delete(`/api/tasks/${taskId}`)
      .catch(() => {});
  });

  test("POST /tasks should create a new task", async () => {
    const taskData = {
      name: "Test Task",
      description: "This is a test task",
      weekly: true,
      done: false,
      user_id: "67ecf50fe1ec65f57a487989",
      accommodation_id: "67e922f5f031d41cd1da4fe4",
    };

    const response = await request(app)
      .post("/api/tasks")
      .send(taskData)
      .expect(201);

    expect(response.body).toHaveProperty("task");
    taskId = response.body.task._id;
  });

  test("GET /tasks should return all tasks", async () => {
    const response = await request(app).get("/api/tasks").expect(200);
    expect(Array.isArray(response.body.tasks)).toBe(true);
  });

  test("GET /tasks/:id should return a task by ID", async () => {
    const response = await request(app).get(`/api/tasks/${taskId}`).expect(200);
    expect(response.body).toHaveProperty("_id", taskId);
  });

  test("PUT /tasks/:id should update a task by ID", async () => {
    const updatedData = {
      name: "Updated Test Task",
      description: "This is an updated test task",
      done: true,
    };

    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toHaveProperty("_id", taskId);
  });

  test("DELETE /tasks/:id should delete a task by ID", async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .expect(200);
    expect(response.body).toHaveProperty("message", "OK.");

    await request(app).get(`/api/tasks/${taskId}`).expect(404);
  });
});

export default {};
