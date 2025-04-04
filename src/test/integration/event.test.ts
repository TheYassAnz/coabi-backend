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
      planned_date: "2023-12-01T10:00:00.000Z",
      end_date: "2023-12-01T12:00:00.000Z",
      user_id: "67ecf50fe1ec65f57a487989",
      accommodation_id: "67e922f5f031d41cd1da4fe4",
    };

    const response = await request(app)
      .post("/api/events")
      .send(eventData)
      .expect(201);

    expect(response.body).toHaveProperty("event");
    eventId = response.body.event._id;
  });

  test("GET /events should return all events", async () => {
    const response = await request(app).get("/api/events").expect(200);
    expect(Array.isArray(response.body.events)).toBe(true);
  });

  test("GET /events/:id should return an event by ID", async () => {
    const response = await request(app)
      .get(`/api/events/${eventId}`)
      .expect(200);
    expect(response.body).toHaveProperty("_id", eventId);
  });

  test("PUT /events/:id should update an event by ID", async () => {
    const updatedData = {
      title: "Updated Test Event",
      description: "This is an updated test event",
    };

    const response = await request(app)
      .put(`/api/events/${eventId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toHaveProperty("event");
  });

  test("DELETE /events/:id should delete an event by ID", async () => {
    const response = await request(app)
      .delete(`/api/events/${eventId}`)
      .expect(200);
    expect(response.body).toHaveProperty("message", "OK.");

    await request(app).get(`/api/events/${eventId}`).expect(404);
  });
});

export default {};
