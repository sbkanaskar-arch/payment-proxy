import { summarizeRisk } from "../../src/services/llmService";


describe("summarizeRisk", () => {
    it("should generate explanation with reasons", async () => {
      const explanation = await summarizeRisk({
        amount: 500,
        currency: "USD",
        score: 0.7,
        reasons: ["high_amount", "suspicious_domain"],
        routed: true,
        provider: "PayPal"
      });
  
      expect(explanation).toContain("Risk score 0.7");
      expect(explanation).toContain("PayPal");
      expect(explanation).toContain("high_amount");
    });
  
    it("should use cache if called with same input", async () => {
      const input = {
        amount: 200,
        currency: "USD",
        score: 0.2,
        reasons: [],
        routed: false,
        provider: null
      };
  
      const first = await summarizeRisk(input);
      const second = await summarizeRisk(input);
  
      expect(second).toBe(first); // comes from cache
    });
  });
  