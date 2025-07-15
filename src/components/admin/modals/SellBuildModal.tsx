
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  User,
  ShoppingCart,
  Package,
  Store
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
}

interface PCBuild {
  id: number;
  name: string;
  description: string;
  components: any[];
  totalPrice: number;
  isCompatible: boolean;
}

interface SellBuildModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  build: PCBuild | null;
  onSell: (customerId: number, buildId: number, customerData: any, storeId: number) => void;
}

const mockStores = [
  { id: 1, name: 'Магазин на Тверской', address: 'ул. Тверская, 15' },
  { id: 2, name: 'Магазин в ТЦ Европейский', address: 'пл. Киевского Вокзала, 2' },
  { id: 3, name: 'Магазин на Арбате', address: 'ул. Арбат, 28' },
  { id: 4, name: 'Интернет-магазин', address: 'Доставка по России' }
];

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Иван Петров',
    email: 'ivan.petrov@example.com',
    phone: '+7 (999) 123-45-67',
    city: 'Москва'
  },
  {
    id: 2,
    name: 'Анна Сидорова',
    email: 'anna.sidorova@example.com',
    phone: '+7 (999) 234-56-78',
    city: 'Санкт-Петербург'
  },
  {
    id: 3,
    name: 'Михаил Козлов',
    email: 'mikhail.kozlov@example.com',
    phone: '+7 (999) 345-67-89',
    city: 'Казань'
  }
];

export function SellBuildModal({ open, onOpenChange, build, onSell }: SellBuildModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSell = () => {
    if (!build || !selectedCustomer || !selectedStore) return;

    onSell(selectedCustomer.id, build.id, selectedCustomer, selectedStore);
    
    // Сброс формы
    setSelectedCustomer(null);
    setSelectedStore(null);
    setSearchTerm('');
    onOpenChange(false);
  };

  const handleCreateAndSell = () => {
    if (!build || !newCustomer.name || !newCustomer.phone || !selectedStore) return;

    const customer = {
      id: Math.max(...mockCustomers.map(c => c.id)) + 1,
      ...newCustomer
    };

    onSell(customer.id, build.id, customer, selectedStore);
    
    // Сброс формы
    setNewCustomer({ name: '', email: '', phone: '', city: '' });
    setSelectedStore(null);
    setShowNewCustomerForm(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedCustomer(null);
    setSelectedStore(null);
    setSearchTerm('');
    setShowNewCustomerForm(false);
    setNewCustomer({ name: '', email: '', phone: '', city: '' });
    onOpenChange(false);
  };

  if (!build) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Продать сборку "{build.name}"</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Информация о сборке */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{build.name}</h3>
              <Badge variant={build.isCompatible ? 'default' : 'destructive'}>
                {build.isCompatible ? 'Совместимо' : 'Несовместимо'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{build.description}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{build.components.length} компонентов</span>
              </div>
              <div className="font-semibold text-lg">
                {build.totalPrice.toLocaleString()} ₽
              </div>
            </div>
          </div>

          {/* Выбор магазина */}
          <div className="space-y-2">
            <Label>Выберите магазин</Label>
            <Select value={selectedStore?.toString()} onValueChange={(value) => setSelectedStore(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите магазин для продажи">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    {selectedStore ? mockStores.find(s => s.id === selectedStore)?.name : "Выберите магазин"}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {mockStores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{store.name}</span>
                      <span className="text-xs text-muted-foreground">{store.address}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!showNewCustomerForm ? (
            <>
              {/* Поиск клиента */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Выберите клиента</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewCustomerForm(true)}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Новый клиент
                  </Button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Поиск по имени или email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCustomer?.id === customer.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-600">
                        {customer.email} • {customer.phone} • {customer.city}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Форма нового клиента */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Новый клиент</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewCustomerForm(false)}
                  >
                    Выбрать существующего
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя *</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Введите имя"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Город</Label>
                    <Input
                      id="city"
                      value={newCustomer.city}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Введите город"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Отмена
            </Button>
            {!showNewCustomerForm ? (
              <Button 
                onClick={handleSell}
                disabled={!selectedCustomer || !selectedStore}
                className="flex-1 gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Продать сборку
              </Button>
            ) : (
              <Button 
                onClick={handleCreateAndSell}
                disabled={!newCustomer.name || !newCustomer.phone || !selectedStore}
                className="flex-1 gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Создать и продать
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
