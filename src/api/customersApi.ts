// customersApi.ts

import type { Customer } from "@/components/admin/CustomersPage";

const STORAGE_KEY = "customers";

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Иван Петров',
    email: 'ivan.petrov@example.com',
    phone: '+7 (999) 123-45-67',
    city: 'Москва',
    totalOrders: 8,
    totalSpent: 456000,
    lastOrder: '2024-01-15',
    status: 'VIP',
    registered: '2023-05-12'
  },
  {
    id: 2,
    name: 'Анна Сидорова',
    email: 'anna.sidorova@example.com',
    phone: '+7 (999) 234-56-78',
    city: 'Санкт-Петербург',
    totalOrders: 3,
    totalSpent: 189000,
    lastOrder: '2024-01-14',
    status: 'Постоянный',
    registered: '2023-08-22'
  },
  {
    id: 3,
    name: 'Михаил Козлов',
    email: 'mikhail.kozlov@example.com',
    phone: '+7 (999) 345-67-89',
    city: 'Казань',
    totalOrders: 12,
    totalSpent: 675000,
    lastOrder: '2024-01-13',
    status: 'VIP',
    registered: '2023-03-08'
  },
  {
    id: 4,
    name: 'Елена Васильева',
    email: 'elena.vasileva@example.com',
    phone: '+7 (999) 456-78-90',
    city: 'Екатеринбург',
    totalOrders: 1,
    totalSpent: 78000,
    lastOrder: '2024-01-16',
    status: 'Новый',
    registered: '2024-01-10'
  },
  {
    id: 5,
    name: 'Дмитрий Смирнов',
    email: 'dmitry.smirnov@example.com',
    phone: '+7 (999) 567-89-01',
    city: 'Новосибирск',
    totalOrders: 5,
    totalSpent: 234000,
    lastOrder: '2024-01-12',
    status: 'Постоянный',
    registered: '2023-09-15'
  },
];

function getCustomers(): Customer[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return mockCustomers;
    }
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCustomers));
    return mockCustomers;
  }
}

function setCustomers(customers: Customer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

function addCustomer(customer: Omit<Customer, "id">): Customer {
  const customers = getCustomers();
  const newCustomer: Customer = {
    ...customer,
    id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
  };
  const updated = [...customers, newCustomer];
  setCustomers(updated);
  return newCustomer;
}

function updateCustomer(id: number, updates: Partial<Customer>): Customer | null {
  const customers = getCustomers();
  const idx = customers.findIndex(c => c.id === id);
  if (idx === -1) return null;
  const updatedCustomer = { ...customers[idx], ...updates };
  customers[idx] = updatedCustomer;
  setCustomers(customers);
  return updatedCustomer;
}

function deleteCustomer(id: number) {
  const customers = getCustomers();
  const updated = customers.filter(c => c.id !== id);
  setCustomers(updated);
}

export { getCustomers, setCustomers, addCustomer, updateCustomer, deleteCustomer }; 