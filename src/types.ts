export type UserRole = "admin" | "farmer" | "worker";
export type EquipmentStatus = "available" | "in_use" | "maintenance" | "broken";

export interface Crop {
  id: string;
  name: string;
  variety: string;
  plantingDate?: Date;
  harvestDate?: Date;
  yield: number;
}

export interface Livestock {
  id: string;
  type: string;
  breed: string;
  age: number;
  healthStatus: string;
  inventoryCount: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  usageHours: number;
  maintenanceSchedule: Date[];
}

export interface WeatherData {
  date: string;
  temperature: number;
  precipitation: number;
}

export interface FinancialRecord {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: "income" | "expense";
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
}
