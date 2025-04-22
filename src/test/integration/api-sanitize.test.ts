import request from "supertest";
import app from "../../app";

describe("XSS sanitization Test", () => {
  let taskId = "";

  afterAll(async () => {
    await request(app)
      .delete(`/api/tasks/${taskId}`)
      .catch(() => {});
  });

  test("POST /tasks should create a new task", async () => {
    const taskData = {
      name: "Sanitize Test",
      description: "<script>alert('XSS')</script>",
      weekly: true,
      userId: "67ecf50fe1ec65f57a487989",
      accommodationId: "67e922f5f031d41cd1da4fe4",
    };

    const response = await request(app)
      .post("/api/tasks")
      .send(taskData)
      .expect(201);

    expect(response.body).toHaveProperty("message", "Ok");
    expect(response.body.data).toHaveProperty("description", "");
    taskId = response.body.data._id;
  });
});

export default {};
