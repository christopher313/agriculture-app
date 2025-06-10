type Animal = { id: string; type: string; name: string };

class LivestockManager {
  private livestock: Animal[] = [];

  getLivestock() {
    return this.livestock;
  }

  addLivestock(animal: Animal) {
    this.livestock.push(animal);
  }

  removeLivestock(id: string) {
    this.livestock = this.livestock.filter((a) => a.id !== id);
  }

  updateLivestock(id: string, data: Partial<Animal>) {
    const animal = this.livestock.find((a) => a.id === id);
    if (animal) {
      Object.assign(animal, data);
    }
  }

  findById(id: string) {
    return this.livestock.find((a) => a.id === id);
  }
}

export default LivestockManager;
