import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Upload,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { AddProductModal } from './modals/AddProductModal';
import { getProducts, setProducts, addProduct, updateProduct, deleteProduct } from "@/api/productsApi";

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  specifications: string;
}

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

const categoryLabels = {
  cpu: 'Процессоры',
  gpu: 'Видеокарты',
  ram: 'Оперативная память',
  storage: 'Накопители',
  motherboard: 'Материнские платы',
  psu: 'Блоки питания',
  case: 'Корпуса',
  cooling: 'Охлаждение'
};

export function ProductsPage() {
  const [products, setProductsState] = useState<Product[]>(getProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'stock' | 'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name) * order;
    }
    return (a[sortBy] - b[sortBy]) * order;
  });

  const handleAddProduct = (productData: any) => {
    const newProduct = addProduct(productData);
    const updated = getProducts();
    setProductsState(updated);
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Удалить этот товар?')) {
      deleteProduct(id);
      setProductsState(getProducts());
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = (productData: any) => {
    if (!editProduct) return;
    updateProduct(editProduct.id, productData);
    setProductsState(getProducts());
    setIsEditModalOpen(false);
    setEditProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Комплектующие</h1>
          <p className="text-gray-600 mt-1">Управление товарами и остатками</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Импорт
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить товар
          </Button>
        </div>
      </div>

      {/* Фильтры и сортировка */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Поиск по названию или бренду..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Все категории</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'stock' | 'name')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Сортировать по названию</option>
              <option value="price">Сортировать по цене</option>
              <option value="stock">Сортировать по остаткам</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Таблица товаров */}
      <Card>
        <CardHeader>
          <CardTitle>Список комплектующих</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Товар</th>
                  <th className="text-left py-3 px-4">Категория</th>
                  <th className="text-left py-3 px-4">Цена</th>
                  <th className="text-left py-3 px-4">Остатки</th>
                  <th className="text-left py-3 px-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge>{categoryLabels[product.category]}</Badge>
                    </td>
                    <td className="py-3 px-4">{product.price.toLocaleString()} ₽</td>
                    <td className="py-3 px-4">{product.stock} шт.</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => handleEditProduct(product)}>
                          <Edit className="h-3 w-3" />
                          Изменить
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-3 w-3" />
                          Удалить
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Модальное окно добавления товара */}
      <AddProductModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddProduct}
      />
      <AddProductModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleUpdateProduct}
        initialData={editProduct ? {
          name: editProduct.name,
          brand: editProduct.brand,
          category: editProduct.category,
          price: editProduct.price,
          stock: editProduct.stock,
          description: editProduct.description,
          specifications: editProduct.specifications
        } : undefined}
        editMode={true}
      />
    </div>
  );
}
