export type Department = 'IT' | 'HR' | 'Sales' | 'Support' | 'Clerks' | 'Electric';

export type Permission = 'view' | 'edit' | 'add' | 'delete';

export interface User {
  id: string;
  username: string;
  password: string; // Note: In a real app, never store plain text passwords
  name: string;
  department: Department;
  isAdmin: boolean;
  permissions: Permission[];
  email: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  department: Department;
  quantity: number;
  status: 'available' | 'low' | 'out-of-stock';
  lastUpdated: string;
  category: string;
  location: string;
  addedBy: string;
}

export interface DepartmentSummary {
  department: Department;
  totalItems: number;
  availableItems: number;
  lowStockItems: number;
  outOfStockItems: number;
}