interface Crop {
  id: number;
  name: string;
  variety: string;
  area: number;
  yield: number;
}

class CropManager {
  private crops: Crop[] = [];

  addCrop(crop: Crop): void {
    this.crops.push(crop);
  }

  updateCrop(id: number, updatedCrop: Partial<Crop>): void {
    const cropIndex = this.crops.findIndex((crop) => crop.id === id);
    if (cropIndex !== -1) {
      this.crops[cropIndex] = { ...this.crops[cropIndex], ...updatedCrop };
    }
  }

  removeCrop(id: number): void {
    this.crops = this.crops.filter((crop) => crop.id !== id);
  }

  getCrops(): Crop[] {
    return this.crops;
  }

  getCropById(id: number): Crop | undefined {
    return this.crops.find((crop) => crop.id === id);
  }

  findByName(name: string) {
    return this.crops.filter((crop) =>
      crop.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  findByVariety(variety: string) {
    return this.crops.filter((crop) =>
      crop.variety.toLowerCase().includes(variety.toLowerCase())
    );
  }
}

export default CropManager;
