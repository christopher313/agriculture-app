import { Equipment } from "../../types";

class EquipmentManager {
  private equipmentInventory: Equipment[] = [];

  constructor() {}

  addEquipment(equipment: Equipment): void {
    if (this.equipmentInventory.find((eq) => eq.id === equipment.id)) {
      throw new Error("Équipement déjà existant avec cet ID.");
    }
    this.equipmentInventory.push(equipment);
  }

  removeEquipment(id: string): void {
    this.equipmentInventory = this.equipmentInventory.filter(
      (eq) => eq.id !== id
    );
  }

  updateEquipment(id: string, updatedEquipment: Equipment): void {
    const index = this.equipmentInventory.findIndex((eq) => eq.id === id);
    if (index !== -1) {
      this.equipmentInventory[index] = updatedEquipment;
    }
  }

  trackUsage(id: string, hours: number): void {
    const equipment = this.getEquipment(id);
    if (equipment && hours > 0) {
      equipment.usageHours += hours;
    }
  }

  scheduleMaintenance(id: string, date: Date): void {
    const equipment = this.getEquipment(id);
    if (equipment) {
      equipment.maintenanceSchedule.push(date);
    }
  }

  getEquipment(id: string): Equipment | undefined {
    return this.equipmentInventory.find((eq) => eq.id === id);
  }

  getAllEquipment(): Equipment[] {
    return this.equipmentInventory;
  }

  findByName(name: string): Equipment[] {
    return this.equipmentInventory.filter((eq) =>
      eq.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  findByType(type: string): Equipment[] {
    return this.equipmentInventory.filter(
      (eq) => eq.type.toLowerCase() === type.toLowerCase()
    );
  }
}

export default EquipmentManager;
