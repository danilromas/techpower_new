import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Package, AlertTriangle, Plus, Minus } from 'lucide-react';

const mockInventory = [
  { id: 1, name: 'Intel Core i5-13400F', category: 'Процессоры', stock: 15, minStock: 5, price: 18000, supplier: 'DNS' },
  { id: 2, name: 'RTX 4060 Ti', category: 'Видеокарты', stock: 3, minStock: 10, price: 45000, supplier: 'Ситилинк' },
  { id: 3, name: 'DDR4 16GB Corsair', category: 'Память', stock: 25, minStock: 10, price: 6000, supplier: 'DNS' },
  { id: 4, name: 'MSI B450M Pro', category: 'Материнские платы', stock: 8, minStock: 5, price: 7500, supplier: 'DNS' },
  { id: 5, name: 'Corsair RM750x', category: 'Блоки питания', stock: 12, minStock: 5, price: 12000, supplier: 'Ситилинк' },
];

export function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState(mockInventory);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.stock <= item.minStock);

  const updateStock = (id: number, change: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id 
        ? { ...item, stock: Math.max(0, item.stock + change) }
        : item
    ));
  };

  const getStockBadge = (stock: number, minStock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Нет в наличии</Badge>;
    } else if (stock <= minStock) {
      return <Badge variant="secondary">Мало на складе</Badge>;
    } else {
      return <Badge variant="default">В наличии</Badge>;
    }
  };

  const getTotalValue = () => {
    return inventory.reduce((total, item) => total + (item.stock * item.price), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Складской учет</h1>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая стоимость склада</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalValue().toLocaleString()} ₽</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Товаров в наличии</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.reduce((sum, item) => sum + item.stock, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Товаров с низким остатком</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockItems.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Поиск */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Таблица товаров */}
      <Card>
        <CardHeader>
          <CardTitle>Товары на складе</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Товар</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Остаток</TableHead>
                <TableHead>Мин. остаток</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Поставщик</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{item.minStock}</TableCell>
                  <TableCell>{item.price.toLocaleString()} ₽</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{getStockBadge(item.stock, item.minStock)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(item.id, -1)}
                        disabled={item.stock === 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}