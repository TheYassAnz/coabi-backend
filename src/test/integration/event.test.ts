import request from "supertest";
import app from "../../app";

describe("Event API Integration Tests", () => {
  let eventId = "";

  afterAll(async () => {
    await request(app)
      .delete(`/api/events/${eventId}`)
      .catch(() => {});
  });

  test("POST /events should create a new event", async () => {
    const eventData = {
      title: "Test Event",
      description: "This is a test event",
      plannedDate: "2023-12-01T10:00:00.000Z",
      endDate: "2023-12-01T12:00:00.000Z",
      userId: "67ecf50fe1ec65f57a487989",
      accommodationId: "67e922f5f031d41cd1da4fe4",
    };

    const response = await request(app)
      .post("/api/events")
      .send(eventData)
      .expect(201);

    expect(response.body).toHaveProperty("message", "Ok");
    expect(response.body.data).toHaveProperty("title", "Test Event");
    eventId = response.body.data._id;
  });

  test("POST /events should return 400 for invalid data", async () => {
    const invalidEventData = {
      title: "",
      description: "This is a test event",
      plannedDate: "invalid-date",
      endDate: "2023-12-01T12:00:00.000Z",
      userId: "invalid-user-id",
      accommodationId: "67e922f5f031d41cd1da4fe4",
    };

    const response = await request(app)
      .post("/api/events")
      .send(invalidEventData)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Bad request");
  });

  test("GET /events should return all events", async () => {
    const response = await request(app).get("/api/events").expect(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("GET /events/:id should return an event by ID", async () => {
    const response = await request(app)
      .get(`/api/events/${eventId}`)
      .expect(200);
    expect(response.body).toHaveProperty("message", "Ok");
    expect(response.body.data).toHaveProperty("_id", eventId);
  });

  test("GET /events/filter should return events by filter", async () => {
    const params = {
      planned_date_start: "2022-12-01T10:00:00.000Z",
      planned_date_end: "2024-12-01T12:00:00.000Z",
    };

    const response = await request(app)
      .get("/api/events/filter")
      .query(params)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test("PUT /events/:id should update an event by ID", async () => {
    const updatedData = {
      title: "Updated Test Event",
      description: "This is an updated test event",
    };

    const response = await request(app)
      .patch(`/api/events/${eventId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toHaveProperty("message", "Ok");
    expect(response.body.data).toHaveProperty("_id", eventId);
    expect(response.body.data).toHaveProperty("title", "Updated Test Event");
  });

  test("DELETE /events/:id should delete an event by ID", async () => {
    await request(app).delete(`/api/events/${eventId}`).expect(204);

    await request(app).get(`/api/events/${eventId}`).expect(404);
  });
});

export default {};
