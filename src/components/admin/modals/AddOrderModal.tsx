import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, Minus, Search } from 'lucide-react';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (order: any) => void;
}

const availableProducts = [
  { id: 1, name: 'AMD Ryzen 7 5800X', category: 'Процессор', price: 25000, stock: 15 },
  { id: 2, name: 'NVIDIA GeForce RTX 4070', category: 'Видеокарта', price: 65000, stock: 8 },
  { id: 3, name: 'ASUS ROG STRIX B550-F', category: 'Материнская плата', price: 18000, stock: 12 },
  { id: 4, name: 'Corsair Vengeance 32GB DDR4', category: 'Оперативная память', price: 12000, stock: 20 },
  { id: 5, name: 'Samsung 980 PRO 1TB NVMe', category: 'Накопитель', price: 15000, stock: 25 },
];

const managers = [
  { id: 1, name: 'Анна С.' },
  { id: 2, name: 'Михаил К.' },
  { id: 3, name: 'Елена В.' },
];

export function AddOrderModal({ isOpen, onClose, onAddOrder }: AddOrderModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [orderItems, setOrderItems] = useState<Array<{id: number, name: string, price: number, quantity: number}>>([]);
  const [productSearch, setProductSearch] = useState('');
  const [notes, setNotes] = useState('');

  const addProduct = (product: typeof availableProducts[0]) => {
    const existingItem = orderItems.find(item => item.id === product.id);
    if (existingItem) {
      setOrderItems(orderItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  const removeProduct = (productId: number) => {
    setOrderItems(orderItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
    } else {
      setOrderItems(orderItems.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = () => {
    if (!customerName || !customerPhone || !customerCity || !selectedManager || orderItems.length === 0) {
      return;
    }

    const newOrder = {
      customer: customerName,
      phone: customerPhone,
      city: customerCity,
      manager: selectedManager,
      items: orderItems,
      total: getTotalAmount(),
      notes
    };

    onAddOrder(newOrder);
    handleClose();
  };

  const handleClose = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerCity('');
    setSelectedManager('');
    setOrderItems([]);
    setProductSearch('');
    setNotes('');
    onClose();
  };

  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать новый заказ</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Информация о клиенте */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Информация о клиенте</h3>
            
            <div>
              <Label htmlFor="customerName">Имя клиента *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Введите имя клиента"
              />
            </div>

            <div>
              <Label htmlFor="customerPhone">Телефон *</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div>
              <Label htmlFor="customerCity">Город *</Label>
              <Input
                id="customerCity"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                placeholder="Введите город"
              />
            </div>

            <div>
              <Label htmlFor="manager">Ответственный менеджер *</Label>
              <Select value={selectedManager} onValueChange={setSelectedManager}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите менеджера" />
                </SelectTrigger>
                <SelectContent>
                  {managers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.name}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Примечания</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Дополнительная информация..."
                rows={3}
              />
            </div>
          </div>

          {/* Товары */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Товары в заказе</h3>
            
            {/* Поиск товаров */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Поиск товаров..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Доступные товары */}
            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                    <p className="text-sm font-semibold">{product.price.toLocaleString()} ₽</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addProduct(product)}
                    disabled={product.stock === 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Выбранные товары */}
            <div className="space-y-2">
              <h4 className="font-medium">Выбранные товары:</h4>
              {orderItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">Товары не выбраны</p>
              ) : (
                orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm">{item.price.toLocaleString()} ₽</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Итого */}
            {orderItems.length > 0 && (
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Итого:</span>
                  <span>{getTotalAmount().toLocaleString()} ₽</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!customerName || !customerPhone || !customerCity || !selectedManager || orderItems.length === 0}
          >
            Создать заказ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}