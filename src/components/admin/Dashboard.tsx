
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const salesData = [
  { name: 'Янв', value: 1200000 },
  { name: 'Фев', value: 1900000 },
  { name: 'Мар', value: 1500000 },
  { name: 'Апр', value: 2200000 },
  { name: 'Май', value: 2800000 },
  { name: 'Июн', value: 3200000 },
];

const productCategories = [
  { name: 'Процессоры', value: 35, color: '#3B82F6' },
  { name: 'Видеокарты', value: 25, color: '#10B981' },
  { name: 'ОЗУ', value: 20, color: '#F59E0B' },
  { name: 'SSD', value: 15, color: '#EF4444' },
  { name: 'Прочее', value: 5, color: '#8B5CF6' },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'Иван Петров', total: 125000, status: 'В сборке', city: 'Москва' },
  { id: '#ORD-002', customer: 'Анна Сидорова', total: 89000, status: 'Доставка', city: 'СПб' },
  { id: '#ORD-003', customer: 'Михаил Козлов', total: 156000, status: 'Завершен', city: 'Казань' },
  { id: '#ORD-004', customer: 'Елена Васильева', total: 78000, status: 'Принят', city: 'Екатеринбург' },
];

const lowStockItems = [
  { name: 'Intel Core i7-13700K', stock: 3, category: 'Процессоры' },
  { name: 'RTX 4070 Ti Super', stock: 1, category: 'Видеокарты' },
  { name: 'DDR5-6000 32GB', stock: 2, category: 'ОЗУ' },
];

export function Dashboard() {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Принят': { variant: 'secondary' as const, icon: CheckCircle2 },
      'В сборке': { variant: 'default' as const, icon: Package },
      'Доставка': { variant: 'outline' as const, icon: TrendingUp },
      'Завершен': { variant: 'destructive' as const, icon: CheckCircle2 },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Принят'];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Добро пожаловать в панель управления TechPower</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Последнее обновление</p>
          <p className="text-sm font-medium">{new Date().toLocaleString('ru-RU')}</p>
        </div>
      </div>

      {/* Ключевые метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Выручка за месяц</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2М ₽</div>
            <div className="flex items-center text-xs opacity-90">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% к прошлому месяцу
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Заказы</CardTitle>
            <ShoppingCart className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">147</div>
            <div className="flex items-center text-xs opacity-90">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% к прошлому месяцу
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Клиенты</CardTitle>
            <Users className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <div className="flex items-center text-xs opacity-90">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3% к прошлому месяцу
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Товары</CardTitle>
            <Package className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center text-xs opacity-90">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.1% к прошлому месяцу
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Графики и таблицы */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Динамика продаж</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} ₽`, 'Выручка']} />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Популярные категории</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {productCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Последние заказы и уведомления */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer} • {order.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total.toLocaleString()} ₽</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Низкие остатки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <Badge variant="destructive">
                    Осталось: {item.stock}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
