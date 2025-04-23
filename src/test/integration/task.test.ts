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
      userId: "67ecf50fe1ec65f57a487989",
      accommodationId: "67e922f5f031d41cd1da4fe4",
    };

    const response = await request(app)
      .post("/api/tasks")
      .send(taskData)
      .expect(201);

    expect(response.body).toHaveProperty("message", "Ok");
    expect(response.body.data).toHaveProperty("name", "Test Task");
    taskId = response.body.data._id;
  });

  test("POST /tasks should return 400 if required fields are missing", async () => {
    const invalidTaskData = {
      name: "Test Task",
      description: "This is a test task",
      weekly: "true",
      done: "false",
      userId: "01010001001001010101010",
      accommodationId: "0101010010001010101010",
    };

    const response = await request(app)
      .post("/api/tasks")
      .send(invalidTaskData)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Bad request");
  });

  test("GET /tasks should return all tasks", async () => {
    const response = await request(app).get("/api/tasks").expect(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("GET /tasks/:id should return a task by ID", async () => {
    const response = await request(app).get(`/api/tasks/${taskId}`).expect(200);
    expect(response.body).toHaveProperty("message", "Ok");
    expect(response.body.data).toHaveProperty("_id", taskId);
  });

  test("GET /tasks/filter should return tasks by filter", async () => {
    const params = {
      weekly: true,
      done: false,
    };

    const response = await request(app)
      .get("/api/tasks/filter")
      .query(params)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test("PUT /tasks/:id should update a task by ID", async () => {
    const updatedData = {
      name: "Updated Test Task",
      description: "This is an updated test task",
      done: true,
    };

    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toHaveProperty("message", "Ok");
    expect(response.body.data).toHaveProperty("_id", taskId);
    expect(response.body.data).toHaveProperty("done", true);
  });

  test("DELETE /tasks/:id should delete a task by ID", async () => {
    await request(app).delete(`/api/tasks/${taskId}`).expect(204);

    await request(app).get(`/api/tasks/${taskId}`).expect(404);
  });
});

export default {};
