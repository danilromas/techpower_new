
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus
} from 'lucide-react';
import { ViewOrderModal } from './modals/ViewOrderModal';
import { ChangeOrderStatusModal } from './modals/ChangeOrderStatusModal';
import { AddOrderModal } from './modals/AddOrderModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOrders, setOrders, addOrder, updateOrder, deleteOrder } from "@/api/ordersApi";

export interface Order {
  id: string;
  customer: string;
  phone: string;
  city: string;
  total: number;
  status: string;
  date: string;
  items: number;
  manager: string;
}

const orders = [
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

export function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewOrderModal, setViewOrderModal] = useState(false);
  const [changeStatusModal, setChangeStatusModal] = useState(false);
  const [addOrderModal, setAddOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [ordersData, setOrdersData] = useState(getOrders());
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Принят': { variant: 'secondary' as const, icon: Clock, color: 'bg-blue-100 text-blue-800' },
      'В сборке': { variant: 'default' as const, icon: Package, color: 'bg-yellow-100 text-yellow-800' },
      'Доставка': { variant: 'outline' as const, icon: Truck, color: 'bg-purple-100 text-purple-800' },
      'Завершен': { variant: 'destructive' as const, icon: CheckCircle2, color: 'bg-green-100 text-green-800' },
      'Отмена': { variant: 'destructive' as const, icon: AlertCircle, color: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Принят'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setViewOrderModal(true);
  };

  const handleChangeStatus = (order: any) => {
    setSelectedOrder(order);
    setChangeStatusModal(true);
  };

  const handleStatusChange = (orderId: string, newStatus: string, comment: string) => {
    updateOrder(orderId, { status: newStatus });
    setOrdersData(getOrders());
    toast({
      title: "Статус изменен",
      description: `Статус заказа ${orderId} изменен на "${newStatus}"`,
    });
  };

  const handleAddOrder = (newOrderData: any) => {
    addOrder({ ...newOrderData, status: 'Принят', date: new Date().toISOString().split('T')[0], items: newOrderData.items.length });
    setOrdersData(getOrders());
    toast({
      title: "Заказ создан",
      description: `Новый заказ ${newOrderData.id} успешно создан`,
    });
  };

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    return {
      total: ordersData.length,
      accepted: ordersData.filter(o => o.status === 'Принят').length,
      inProgress: ordersData.filter(o => o.status === 'В сборке').length,
      shipping: ordersData.filter(o => o.status === 'Доставка').length,
      completed: ordersData.filter(o => o.status === 'Завершен').length,
      cancelled: ordersData.filter(o => o.status === 'Отмена').length,
    };
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Заказы</h1>
          <p className="text-muted-foreground mt-1">Управление заказами и их статусами</p>
        </div>
        <Button onClick={() => setAddOrderModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Создать заказ
        </Button>
      </div>

      {/* Статистика заказов */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Всего</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.accepted}</p>
            <p className="text-xs text-muted-foreground">Принят</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            <p className="text-xs text-muted-foreground">В сборке</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.shipping}</p>
            <p className="text-xs text-muted-foreground">Доставка</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">Завершен</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-xs text-muted-foreground">Отмена</p>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Поиск по номеру заказа, клиенту или городу..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="Принят">Принят</SelectItem>
                <SelectItem value="В сборке">В сборке</SelectItem>
                <SelectItem value="Доставка">Доставка</SelectItem>
                <SelectItem value="Завершен">Завершен</SelectItem>
                <SelectItem value="Отмена">Отмена</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Список заказов */}
      <Card>
        <CardHeader>
          <CardTitle>Список заказов ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-medium">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Город</p>
                    <p className="font-medium">{order.city}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Товаров</p>
                    <p className="font-medium">{order.items}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Сумма</p>
                    <p className="font-medium">{order.total.toLocaleString()} ₽</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Менеджер</p>
                    <p className="font-medium">{order.manager}</p>
                  </div>
                  
                  <div className="text-center">
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleChangeStatus(order)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Модальные окна */}
      <ViewOrderModal
        isOpen={viewOrderModal}
        onClose={() => setViewOrderModal(false)}
        order={selectedOrder}
      />

      <ChangeOrderStatusModal
        isOpen={changeStatusModal}
        onClose={() => setChangeStatusModal(false)}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />

      <AddOrderModal
        isOpen={addOrderModal}
        onClose={() => setAddOrderModal(false)}
        onAddOrder={handleAddOrder}
      />
    </div>
  );
}
