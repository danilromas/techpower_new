// ordersApi.ts

import type { Order } from "@/components/admin/OrdersPage";

const STORAGE_KEY = "orders";

const mockOrders: Order[] = [
  {
    id: '#ORD-001',
    customer: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    city: 'Москва',
    total: 125000,
    status: 'В сборке',
    date: '2024-01-15',
    items: 5,
    manager: 'Анна С.'
  },
  {
    id: '#ORD-002',
    customer: 'Анна Сидорова',
    phone: '+7 (999) 234-56-78',
    city: 'СПб',
    total: 89000,
    status: 'Доставка',
    date: '2024-01-14',
    items: 3,
    manager: 'Михаил К.'
  },
  {
    id: '#ORD-003',
    customer: 'Михаил Козлов',
    phone: '+7 (999) 345-67-89',
    city: 'Казань',
    total: 156000,
    status: 'Завершен',
    date: '2024-01-13',
    items: 7,
    manager: 'Елена В.'
  },
  {
    id: '#ORD-004',
    customer: 'Елена Васильева',
    phone: '+7 (999) 456-78-90',
    city: 'Екатеринбург',
    total: 78000,
    status: 'Принят',
    date: '2024-01-16',
    items: 4,
    manager: 'Анна С.'
  },
  {
    id: '#ORD-005',
    customer: 'Дмитрий Смирнов',
    phone: '+7 (999) 567-89-01',
    city: 'Новосибирск',
    total: 95000,
    status: 'Отмена',
    date: '2024-01-12',
    items: 2,
    manager: 'Михаил К.'
  },
];

function getOrders(): Order[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return mockOrders;
    }
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrders));
    return mockOrders;
  }
}

function setOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function addOrder(order: Omit<Order, "id">): Order {
  const orders = getOrders();
  const newId = `#ORD-${String(orders.length + 1).padStart(3, '0')}`;
  const newOrder: Order = {
    ...order,
    id: newId,
  };
  const updated = [newOrder, ...orders];
  setOrders(updated);
  return newOrder;
}

function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return null;
  const updatedOrder = { ...orders[idx], ...updates };
  orders[idx] = updatedOrder;
  setOrders(orders);
  return updatedOrder;
}

function deleteOrder(id: string) {
  const orders = getOrders();
  const updated = orders.filter(o => o.id !== id);
  setOrders(updated);
}

export { getOrders, setOrders, addOrder, updateOrder, deleteOrder }; 