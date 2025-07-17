const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getToken() {
  return null; // Отключаем токен полностью
}

async function apiFetch(path: string, options: RequestInit = {}) {
  // Не добавляем Authorization
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...Object.fromEntries(Object.entries(options.headers || {}).map(([k, v]) => [k, String(v)])),
  };
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Products API
export const productsApi = {
  getAll: () => apiFetch('/products'),
  get: (id: number) => apiFetch(`/products/${id}`),
  add: (data: any) => apiFetch('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
};

// Orders API
export const ordersApi = {
  getAll: () => apiFetch('/orders'),
  get: (id: string) => apiFetch(`/orders/${id}`),
  add: (data: any) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/orders/${id}`, { method: 'DELETE' }),
};
// Customers API
export const customersApi = {
  getAll: () => apiFetch('/customers'),
  get: (id: number) => apiFetch(`/customers/${id}`),
  add: (data: any) => apiFetch('/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiFetch(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch(`/customers/${id}`, { method: 'DELETE' }),
};
// Suppliers API
export const suppliersApi = {
  getAll: () => apiFetch('/suppliers'),
  get: (id: number) => apiFetch(`/suppliers/${id}`),
  add: (data: any) => apiFetch('/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiFetch(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch(`/suppliers/${id}`, { method: 'DELETE' }),
};
// Inventory API
export const inventoryApi = {
  getAll: () => apiFetch('/inventory'),
  get: (id: number) => apiFetch(`/inventory/${id}`),
  add: (data: any) => apiFetch('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiFetch(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch(`/inventory/${id}`, { method: 'DELETE' }),
};
// PCBuilds API
export const pcbuildsApi = {
  getAll: () => apiFetch('/pcbuilds'),
  get: (id: number) => apiFetch(`/pcbuilds/${id}`),
  add: (data: any) => apiFetch('/pcbuilds', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiFetch(`/pcbuilds/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiFetch(`/pcbuilds/${id}`, { method: 'DELETE' }),
}; 