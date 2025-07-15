import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Star,
  Plus
} from 'lucide-react';
import { SellBuildModal } from './modals/SellBuildModal';

const customers = [
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

// Mock builds для быстрой продажи
const availableBuilds = [
  {
    id: 1,
    name: 'Сборка для игр 2024',
    description: 'Отличная сборка для современных игр',
    components: [],
    totalPrice: 131000,
    isCompatible: true
  },
  {
    id: 2,
    name: 'Бюджетная сборка',
    description: 'Сборка для работы и учебы',
    components: [],
    totalPrice: 105000,
    isCompatible: true
  }
];

export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState<any>(null);

  const handleQuickSell = (build: any) => {
    setSelectedBuild(build);
    setIsSellModalOpen(true);
  };

  const handleBuildSold = (customerId: number, buildId: number, customerData: any) => {
    console.log('Быстрая продажа:', { customerId, buildId, customerData });
    alert(`Сборка "${selectedBuild?.name}" продана клиенту ${customerData.name}`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'VIP': { color: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white', icon: Star },
      'Постоянный': { color: 'bg-blue-100 text-blue-800', icon: ShoppingBag },
      'Новый': { color: 'bg-green-100 text-green-800', icon: Star },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Новый'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const filteredCustomers = customers.filter(customer => {
    return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.city.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getCustomerStats = () => {
    return {
      total: customers.length,
      vip: customers.filter(c => c.status === 'VIP').length,
      regular: customers.filter(c => c.status === 'Постоянный').length,
      new: customers.filter(c => c.status === 'Новый').length,
    };
  };

  const stats = getCustomerStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Клиенты</h1>
          <p className="text-gray-600 mt-1">База данных клиентов и история покупок</p>
        </div>
        <div className="flex gap-2">
          {availableBuilds.map((build) => (
            <Button
              key={build.id}
              variant="outline"
              onClick={() => handleQuickSell(build)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Продать "{build.name}"
            </Button>
          ))}
        </div>
      </div>

      {/* Статистика клиентов */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Всего клиентов</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">VIP клиенты</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.vip}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Постоянные</p>
                <p className="text-2xl font-bold text-blue-600">{stats.regular}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Новые</p>
                <p className="text-2xl font-bold text-green-600">{stats.new}</p>
              </div>
              <Star className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Поиск */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Поиск по имени, email или городу..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Список клиентов */}
      <Card>
        <CardHeader>
          <CardTitle>Список клиентов ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      {customer.name}
                      {getStatusBadge(customer.status)}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {customer.city}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Заказов</p>
                    <p className="font-medium text-lg">{customer.totalOrders}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Потрачено</p>
                    <p className="font-medium text-lg">{customer.totalSpent.toLocaleString()} ₽</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Последний заказ</p>
                    <p className="font-medium">{new Date(customer.lastOrder).toLocaleDateString('ru-RU')}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Регистрация</p>
                    <p className="font-medium">{new Date(customer.registered).toLocaleDateString('ru-RU')}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Модальное окно продажи сборки */}
      <SellBuildModal
        open={isSellModalOpen}
        onOpenChange={setIsSellModalOpen}
        build={selectedBuild}
        onSell={handleBuildSold}
      />
    </div>
  );
}
