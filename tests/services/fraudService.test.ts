import { computeRisk } from "../../src/services/fraudService";

describe("fraudService", () => {
  it("should flag high amount as risky", () => {
    const input = { amount: 2000, email: "user@example.com" };
    const result = computeRisk(input);

    expect(result.score).toBeGreaterThan(0);
    expect(result.reasons).toContainEqual(expect.stringContaining("high_amount"));
  });

  it("should flag suspicious email domains", () => {
    const input = { amount: 100, email: "fraud@test.com" };
    const result = computeRisk(input);

    expect(result.score).toBeGreaterThan(0);
    expect(result.reasons).toContain("suspicious_email_domain test.com");
  });

  it("should return low score for safe input", () => {
    const input = { amount: 50, email: "user@gmail.com" };
    const result = computeRisk(input);

    expect(result.score).toBe(0);
    expect(result.reasons).toHaveLength(0);
  });
});
