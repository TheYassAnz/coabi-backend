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
      to_refund: 100,
      user_id: "67ecf50fe1ec65f57a487989",
      roomate_id: "67e922f5f031d41cd1da4fe4",
    };

    const response = await request(app)
      .post("/api/refunds")
      .send(refundData)
      .expect(201);

    expect(response.body).toHaveProperty("refund");

    refundId = response.body.refund._id;
  });

  test("GET /refunds should return all refunds", async () => {
    const response = await request(app).get("/api/refunds").expect(200);
    expect(Array.isArray(response.body.refunds)).toBe(true);
  });

  test("GET /refunds/:id should return a refund by ID", async () => {
    const response = await request(app)
      .get(`/api/refunds/${refundId}`)
      .expect(200);
    expect(response.body).toHaveProperty("_id", refundId);
  });

  test("PUT /refunds/:id should update a refund by ID", async () => {
    const updatedData = {
      title: "Test Refund",
      to_refund: 0,
    };

    const response = await request(app)
      .put(`/api/refunds/${refundId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toHaveProperty("_id", refundId);
  });

  test("DELETE /refunds/:id should delete a refund by ID", async () => {
    const response = await request(app)
      .delete(`/api/refunds/${refundId}`)
      .expect(200);
    expect(response.body).toHaveProperty("message", "OK.");

    await request(app).get(`/api/refunds/${refundId}`).expect(404);
  });
});

export default {};
