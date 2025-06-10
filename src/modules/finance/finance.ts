class FinanceManager {
  private records: Array<{ id: string; type: string; amount: number }> = [];

  addRecord(record: { id: string; type: string; amount: number }) {
    this.records.push(record);
  }

  getRecords() {
    return this.records;
  }

  getFinancialData() {
    return {
      revenue: 10000,
      expenses: 5000,
      profit: 5000,
      productionCost: 3000,
      salePrice: 15000,
      grossMargin: 7000,
      netMargin: 4000,
      date: Date.now(),
    };
  }
}

export default FinanceManager;
