import request from "supertest";
import app from "../../app";
import e from "express";

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
      to_split: 200,
      user_id: "67ecf50fe1ec65f57a487989",
      roomate_ids: ["67e922f5f031d41cd1da4fe4"],
    };

    const response = await request(app)
      .post("/api/refunds")
      .send(refundData)
      .expect(201);

    expect(response.body).toHaveProperty("message", "Ok");
    expect(response.body.data[0]).toHaveProperty("title", "Test Refund");
    refundId = response.body.data[0]._id;
  });

  test("POST /refunds should return 400 for invalid data", async () => {
    const invalidRefundData = {
      title: "",
      to_split: -100,
      user_id: "",
      roomate_ids: [],
    };

    const response = await request(app)
      .post("/api/refunds")
      .send(invalidRefundData)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Bad request");
  });

  test("GET /refunds should return all refunds", async () => {
    const response = await request(app).get("/api/refunds").expect(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("GET /refunds/:id should return a refund by ID", async () => {
    const response = await request(app)
      .get(`/api/refunds/${refundId}`)
      .expect(200);
    expect(response.body).toHaveProperty("message", "Ok");
    expect(response.body.data).toHaveProperty("_id", refundId);
  });

  test("GET /refunds/filter should return refunds by filter", async () => {
    const params = {
      to_refund_start: 99,
      to_refund_end: 101,
    };

    const response = await request(app)
      .get("/api/refunds/filter")
      .query(params)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test("PUT /refunds/:id should update a refund by ID", async () => {
    const updatedData = {
      title: "Test Refund",
      to_refund: 0,
    };

    const response = await request(app)
      .patch(`/api/refunds/${refundId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toHaveProperty("message", "Ok");
    expect(response.body.data).toHaveProperty("_id", refundId);
    expect(response.body.data).toHaveProperty("to_refund", 0);
  });

  test("DELETE /refunds/:id should delete a refund by ID", async () => {
    await request(app).delete(`/api/refunds/${refundId}`).expect(204);

    await request(app).get(`/api/refunds/${refundId}`).expect(404);
  });
});

export default {};
