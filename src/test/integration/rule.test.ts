import request from "supertest";
import app from "../../app";

describe("Rule API Integration Tests", () => {
  let ruleId = "";

  afterAll(async () => {
    await request(app)
      .delete(`/api/rules/${ruleId}`)
      .catch(() => {});
  });

  test("POST /rules should create a new rule", async () => {
    const ruleData = {
      title: "Test Rule",
      description: "This is a test rule",
      accommodationId: "67e922f5f031d41cd1da4fe4",
    };

    const response = await request(app)
      .post("/api/rules")
      .send(ruleData)
      .expect(201);

    response.body;
    expect(response.body).toHaveProperty("title", "Test Rule");
    ruleId = response.body._id;
  });

  test("POST /rules should return 400 if required fields are missing", async () => {
    const incompleteRuleData = {
      title: "Test error",
    };

    const response = await request(app)
      .post("/api/rules")
      .send(incompleteRuleData)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Bad request");
  });

  test("GET /rules should return all rules", async () => {
    const response = await request(app).get("/api/rules").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /rules/:id should return a rule by ID", async () => {
    const response = await request(app).get(`/api/rules/${ruleId}`).expect(200);
    response.body;
    expect(response.body).toHaveProperty("_id", ruleId);
  });

  test("PATCH /rules/:id should update a rule by ID", async () => {
    const updatedData = {
      title: "Updated Test Rule",
      description: "This is an updated test rule",
    };

    const response = await request(app)
      .patch(`/api/rules/${ruleId}`)
      .send(updatedData)
      .expect(200);

    response.body;
    expect(response.body).toHaveProperty("_id", ruleId);
    expect(response.body).toHaveProperty("title", "Updated Test Rule");
  });

  test("DELETE /rules/:id should delete a rule by ID", async () => {
    await request(app).delete(`/api/rules/${ruleId}`).expect(204);

    await request(app).get(`/api/rules/${ruleId}`).expect(404);
  });
});

export default {};
