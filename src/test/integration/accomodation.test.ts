import request from "supertest";
import app from "../../app";

describe("Accommodation API Integration Tests", () => {
  let accommodationId = "";

  afterAll(async () => {
    await request(app)
      .delete(`/api/accomodations/${accommodationId}`)
      .catch(() => {});
  });

  test("POST /accommodations should create a new accommodation", async () => {
    const accommodationData = {
      name: "Test Accommodation",
      code: "TST123",
      location: "Test Location",
      postalCode: "12345",
      country: "Test Country",
    };

    const response = await request(app)
      .post("/api/accommodations")
      .send(accommodationData)
      .expect(201);

    expect(response.body).toHaveProperty("_id");
    accommodationId = response.body._id;
  });

  test("POST /accommodations should return 400 for invalid data", async () => {
    const invalidData = {
      name: "",
      code: "2",
    };

    const response = await request(app)
      .post("/api/accommodations")
      .send(invalidData)
      .expect(400);

    expect(response.body).toHaveProperty("error");
  });

  test("GET /accommodations should return all accommodations", async () => {
    const response = await request(app).get("/api/accommodations").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /accommodations/:id should return an accommodation by ID", async () => {
    const response = await request(app)
      .get(`/api/accommodations/${accommodationId}`)
      .expect(200);

    expect(response.body).toHaveProperty("_id", accommodationId);
  });

  test("PUT /accommodations/:id should update an accommodation by ID", async () => {
    const updatedData = {
      name: "Updated Test Accommodation",
      location: "Updated Location",
    };

    const response = await request(app)
      .put(`/api/accommodations/${accommodationId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toHaveProperty("_id", accommodationId);
  });

  test("DELETE /accommodations/:id should delete an accommodation by ID", async () => {
    const response = await request(app)
      .delete(`/api/accommodations/${accommodationId}`)
      .expect(200);

    expect(response.body).toHaveProperty("message", "OK.");

    await request(app)
      .get(`/api/accommodations/${accommodationId}`)
      .expect(404);
  });
});

export default {};
