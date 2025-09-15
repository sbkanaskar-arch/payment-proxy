import request from "supertest";
import app from "../../src/app";

describe("Payment Routes", () => {
  it("GET /health should return ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("GET /charge/transactions should return array", async () => {
    const res = await request(app).get("/charge/transactions");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
