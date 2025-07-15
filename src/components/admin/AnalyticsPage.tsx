
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const salesData = [
  { month: 'Янв', revenue: 1200000, orders: 45, profit: 240000 },
  { month: 'Фев', revenue: 1900000, orders: 67, profit: 380000 },
  { month: 'Мар', revenue: 1500000, orders: 52, profit: 300000 },
  { month: 'Апр', revenue: 2200000, orders: 78, profit: 440000 },
  { month: 'Май', revenue: 2800000, orders: 95, profit: 560000 },
  { month: 'Июн', revenue: 3200000, orders: 112, profit: 640000 },
];

const topProducts = [
  { name: 'RTX 4070 Ti Super', sales: 45, revenue: 4049550 },
  { name: 'Intel Core i7-13700K', sales: 38, revenue: 1367620 },
  { name: 'DDR5-6000 32GB', sales: 52, revenue: 675480 },
  { name: 'Samsung 980 PRO 1TB', sales: 67, revenue: 602330 },
  { name: 'ASUS ROG STRIX Z790', sales: 28, revenue: 1287720 },
];

const cityData = [
  { city: 'Москва', orders: 45, revenue: 1250000 },
  { city: 'СПб', orders: 32, revenue: 890000 },
  { city: 'Казань', orders: 18, revenue: 480000 },
  { city: 'Екатеринбург', orders: 15, revenue: 420000 },
  { city: 'Новосибирск', orders: 12, revenue: 340000 },
];

const categoryDistribution = [
  { name: 'Видеокарты', value: 35, color: '#3B82F6' },
  { name: 'Процессоры', value: 25, color: '#10B981' },
  { name: 'ОЗУ', value: 20, color: '#F59E0B' },
  { name: 'SSD/HDD', value: 15, color: '#EF4444' },
  { name: 'Прочее', value: 5, color: '#8B5CF6' },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Аналитика</h1>
          <p className="text-gray-600 mt-1">Отчеты по продажам, прибыли и клиентам</p>
        </div>
      </div>

      {/* Ключевые показатели */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Выручка (6 мес)</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8М ₽</div>
            <div className="flex items-center text-xs opacity-90">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.2% к предыдущему периоду
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Прибыль (6 мес)</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.56М ₽</div>
            <div className="flex items-center text-xs opacity-90">
              <TrendingUp className="h-3 w-3 mr-1" />
              Маржа: 20%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Заказы (6 мес)</CardTitle>
            <ShoppingCart className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">449</div>
            <div className="flex items-center text-xs opacity-90">
              <TrendingUp className="h-3 w-3 mr-1" />
              Ср. чек: 28,507 ₽
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Клиенты</CardTitle>
            <Users className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">267</div>
            <div className="flex items-center text-xs opacity-90">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18.3% новых клиентов
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Динамика выручки и прибыли</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} ₽`, '']} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Выручка" />
                <Area type="monotone" dataKey="profit" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.8} name="Прибыль" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Количество заказов по месяцам</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#8B5CF6" name="Заказы" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Топ товары и города */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Топ товары по продажам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">Продано: {product.sales} шт</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.revenue.toLocaleString()} ₽</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Продажи по городам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cityData.map((city, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{city.city}</p>
                    <p className="text-sm text-gray-600">Заказов: {city.orders}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{city.revenue.toLocaleString()} ₽</p>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(city.revenue / 1250000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Распределение по категориям */}
      <Card>
        <CardHeader>
          <CardTitle>Распределение продаж по категориям</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              {categoryDistribution.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-gray-600">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
