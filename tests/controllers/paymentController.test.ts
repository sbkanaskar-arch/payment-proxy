import request from "supertest";
import app from "../../src/app";

describe("Payment Controller", () => {
  it("should return 400 if request body is invalid", async () => {
    const res = await request(app).post("/charge").send({});
    expect(res.status).toBe(400);
  });

  it("should create a transaction for valid input", async () => {
    const res = await request(app).post("/charge").send({
      amount: 100,
      source: "tok_visa",
      email: "test@example.com",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("transactionId");
  });
});
