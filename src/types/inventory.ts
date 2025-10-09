export interface InventoryItem {
  id: string;
  name: string;
  category: 'medicamento' | 'material' | 'alimento' | 'equipo' | 'otro';
  description: string;
  quantity: number;
  unit: string;
  minStock: number;
  supplier: string;
  cost: number;
  expirationDate?: string;
  lastRestockDate: string;
  status: 'disponible' | 'bajo_stock' | 'agotado';
}

export type InventoryFormData = Omit<InventoryItem, 'id' | 'status'>;
