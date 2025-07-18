// productsApi.ts

import type { Product } from "@/components/admin/ProductsPage";

const STORAGE_KEY = "products";

// Мок-данные (дублируем из ProductsPage)
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Intel Core i5-13600K',
    brand: 'Intel',
    category: 'cpu',
    price: 25000,
    stock: 50,
    image: '/placeholder.svg',
    description: 'Процессор Intel Core i5-13600K',
    specifications: 'LGA1700, 14 ядер, 20 потоков, 3.5 ГГц'
  },
  {
    id: 2,
    name: 'RTX 4070',
    brand: 'Nvidia',
    category: 'gpu',
    price: 55000,
    stock: 30,
    image: '/placeholder.svg',
    description: 'Видеокарта RTX 4070',
    specifications: '12GB GDDR6X, 192-bit, PCIe 4.0'
  },
  {
    id: 3,
    name: 'Corsair 16GB DDR4-3200',
    brand: 'Corsair',
    category: 'ram',
    price: 6000,
    stock: 100,
    image: '/placeholder.svg',
    description: 'Оперативная память Corsair 16GB DDR4-3200',
    specifications: '16GB (2x8GB), DDR4, 3200MHz'
  }
];

function getProducts(): Product[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return mockProducts;
    }
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
    return mockProducts;
  }
}

function setProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function addProduct(product: Omit<Product, "id">): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
  };
  const updated = [...products, newProduct];
  setProducts(updated);
  return newProduct;
}

function updateProduct(id: number, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const updatedProduct = { ...products[idx], ...updates };
  products[idx] = updatedProduct;
  setProducts(products);
  return updatedProduct;
}

function deleteProduct(id: number) {
  const products = getProducts();
  const updated = products.filter(p => p.id !== id);
  setProducts(updated);
}

export { getProducts, setProducts, addProduct, updateProduct, deleteProduct }; 