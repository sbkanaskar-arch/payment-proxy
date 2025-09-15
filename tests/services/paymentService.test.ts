import { processPayment } from "../../src/services/paymentService";

describe("processPayment", () => {
  it("should return success transaction", async () => {
    const result = await processPayment({
      amount: 200,
      currency: "USD",
      provider: "stripe",
      source: "web"
    });

    expect(result).toHaveProperty("id");
    expect(result.status).toBe("success");
  });

  it("should return unique transaction IDs", async () => {
    const result1 = await processPayment({
      amount: 100,
      currency: "USD",
      provider: "stripe",
      source: "api"
    });

    const result2 = await processPayment({
      amount: 150,
      currency: "EUR",
      provider: "paypal",
      source: "mobile"
    });

    expect(result1.id).not.toBe(result2.id);
  });
});
