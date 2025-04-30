import request from "supertest";
import app from "../../app";

describe("Refund API Integration Tests", () => {
  let refundId = "";

  afterAll(async () => {
    await request(app)
      .delete(`/api/refunds/${refundId}`)
      .catch(() => {});
  });

  test("POST /refunds should create a new refund", async () => {
    const refundData = {
      title: "Test Refund",
      toSplit: 200,
      userId: "67ecf50fe1ec65f57a487989",
      roommateIds: ["67e922f5f031d41cd1da4fe4"],
    };

    const response = await request(app)
      .post("/api/refunds")
      .send(refundData)
      .expect(201);

    response.body;
    expect(response.body[0]).toHaveProperty("title", "Test Refund");
    refundId = response.body[0]._id;
  });

  test("POST /refunds should return 400 for invalid data", async () => {
    const invalidRefundData = {
      title: "",
      toSplit: -100,
      userId: "",
      roommateIds: [],
    };

    const response = await request(app)
      .post("/api/refunds")
      .send(invalidRefundData)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Bad request");
  });

  test("GET /refunds should return all refunds", async () => {
    const response = await request(app).get("/api/refunds").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /refunds/:id should return a refund by ID", async () => {
    const response = await request(app)
      .get(`/api/refunds/${refundId}`)
      .expect(200);
    response.body;
    expect(response.body).toHaveProperty("_id", refundId);
  });

  test("GET /refunds/filter should return refunds by filter", async () => {
    const params = {
      toRefundStart: 99,
      toRefundEnd: 101,
    };

    const response = await request(app)
      .get("/api/refunds/filter")
      .query(params)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("PATCH /refunds/:id should update a refund by ID", async () => {
    const updatedData = {
      title: "Test Refund",
      toRefund: 0,
    };

    const response = await request(app)
      .patch(`/api/refunds/${refundId}`)
      .send(updatedData)
      .expect(200);

    response.body;
    expect(response.body).toHaveProperty("_id", refundId);
    expect(response.body).toHaveProperty("toRefund", 0);
  });

  test("DELETE /refunds/:id should delete a refund by ID", async () => {
    await request(app).delete(`/api/refunds/${refundId}`).expect(204);

    await request(app).get(`/api/refunds/${refundId}`).expect(404);
  });
});

export default {};
