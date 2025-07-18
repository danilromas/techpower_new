
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
import { getOrders } from "@/api/ordersApi";
import { getProducts } from "@/api/productsApi";
import { getCustomers } from "@/api/customersApi";

export function AnalyticsPage() {
  const orders = getOrders();
  const products = getProducts();
  const customers = getCustomers();

  // Выручка и прибыль по месяцам
  const salesByMonth: Record<string, { revenue: number; orders: number; profit: number }> = {};
  orders.forEach(order => {
    const month = order.date.slice(0, 7); // YYYY-MM
    if (!salesByMonth[month]) salesByMonth[month] = { revenue: 0, orders: 0, profit: 0 };
    salesByMonth[month].revenue += order.total;
    salesByMonth[month].orders += 1;
    // Прибыль можно считать как 20% от total (или по-другому, если есть логика)
    salesByMonth[month].profit += Math.round(order.total * 0.2);
  });
  const salesData = Object.entries(salesByMonth).map(([month, data]) => ({
    month,
    ...data
  })).sort((a, b) => a.month.localeCompare(b.month));

  // Топ товаров по продажам (по количеству заказов)
  const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
  orders.forEach(order => {
    // order.items - если это массив товаров, иначе пропустить
    if (Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        if (!productSales[item.name]) productSales[item.name] = { name: item.name, sales: 0, revenue: 0 };
        productSales[item.name].sales += item.quantity || 1;
        productSales[item.name].revenue += (item.price || 0) * (item.quantity || 1);
      });
    }
  });
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // Продажи по городам
  const cityData: Record<string, { city: string; orders: number; revenue: number }> = {};
  orders.forEach(order => {
    if (!cityData[order.city]) cityData[order.city] = { city: order.city, orders: 0, revenue: 0 };
    cityData[order.city].orders += 1;
    cityData[order.city].revenue += order.total;
  });
  const cityDataArr = Object.values(cityData).sort((a, b) => b.revenue - a.revenue);

  // Распределение по категориям (по товарам в заказах)
  const categoryDistribution: Record<string, number> = {};
  orders.forEach(order => {
    if (Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        const product = products.find(p => p.name === item.name);
        const category = product?.category || 'Прочее';
        categoryDistribution[category] = (categoryDistribution[category] || 0) + (item.quantity || 1);
      });
    }
  });
  const totalCategory = Object.values(categoryDistribution).reduce((a, b) => a + b, 0) || 1;
  const categoryDistributionArr = Object.entries(categoryDistribution).map(([name, value], i) => ({
    name,
    value: Math.round((value / totalCategory) * 100),
    color: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][i % 5]
  }));

  // Ключевые показатели
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalProfit = Math.round(totalRevenue * 0.2);
  const totalOrders = orders.length;
  const avgCheck = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const totalClients = customers.length;

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
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} ₽</div>
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
            <div className="text-2xl font-bold">{totalProfit.toLocaleString()} ₽</div>
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
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="flex items-center text-xs opacity-90">
              <TrendingUp className="h-3 w-3 mr-1" />
              Ср. чек: {avgCheck} ₽
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Клиенты</CardTitle>
            <Users className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
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
              {cityDataArr.map((city, index) => (
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
                  data={categoryDistributionArr}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryDistributionArr.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              {categoryDistributionArr.map((category, index) => (
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
