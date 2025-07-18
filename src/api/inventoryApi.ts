// inventoryApi.ts

import type { InventoryItem } from "@/components/admin/InventoryPage";

const STORAGE_KEY = "inventory";

const mockInventory: InventoryItem[] = [
  { id: 1, name: 'Intel Core i5-13400F', category: 'Процессоры', stock: 15, minStock: 5, price: 18000, supplier: 'DNS' },
  { id: 2, name: 'RTX 4060 Ti', category: 'Видеокарты', stock: 3, minStock: 10, price: 45000, supplier: 'Ситилинк' },
  { id: 3, name: 'DDR4 16GB Corsair', category: 'Память', stock: 25, minStock: 10, price: 6000, supplier: 'DNS' },
  { id: 4, name: 'MSI B450M Pro', category: 'Материнские платы', stock: 8, minStock: 5, price: 7500, supplier: 'DNS' },
  { id: 5, name: 'Corsair RM750x', category: 'Блоки питания', stock: 12, minStock: 5, price: 12000, supplier: 'Ситилинк' },
];

function getInventory(): InventoryItem[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return mockInventory;
    }
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockInventory));
    return mockInventory;
  }
}

function setInventory(items: InventoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function addInventoryItem(item: Omit<InventoryItem, "id">): InventoryItem {
  const items = getInventory();
  const newItem: InventoryItem = {
    ...item,
    id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
  };
  const updated = [...items, newItem];
  setInventory(updated);
  return newItem;
}

function updateInventoryItem(id: number, updates: Partial<InventoryItem>): InventoryItem | null {
  const items = getInventory();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  const updatedItem = { ...items[idx], ...updates };
  items[idx] = updatedItem;
  setInventory(items);
  return updatedItem;
}

function deleteInventoryItem(id: number) {
  const items = getInventory();
  const updated = items.filter(i => i.id !== id);
  setInventory(updated);
}

export { getInventory, setInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem }; 