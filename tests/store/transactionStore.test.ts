import { addTransaction, getAllTransactions } from "../../src/store/transactionStore";

describe("transactionStore", () => {
  it("should add a transaction", () => {
    const tx = addTransaction({
      amount: 100,
      currency: "USD",
      source: "web",
      provider: "stripe",
      status: "success",
      riskScore: 0.2,
    });

    expect(tx).toHaveProperty("id");
    expect(tx.amount).toBe(100);
    expect(tx.currency).toBe("USD");
    expect(tx.status).toBe("success");
  });

  it("should return all transactions in reverse order", () => {
    const tx1 = addTransaction({ amount: 50, currency: "EUR", source: "api", status: "success" });
    const tx2 = addTransaction({ amount: 75, currency: "INR", source: "mobile", status: "blocked" });

    const allTx = getAllTransactions();
    expect(allTx[0].id).toBe(tx2.id); // last inserted comes first
    expect(allTx[1].id).toBe(tx1.id);
  });
});
