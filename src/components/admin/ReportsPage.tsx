import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Download, FileText } from 'lucide-react';
import { getOrders } from "@/api/ordersApi";
import { getProducts } from "@/api/productsApi";
import { getCustomers } from "@/api/customersApi";

export function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('sales');

  const orders = getOrders();
  const products = getProducts();
  const customers = getCustomers();

  // Группировка заказов по месяцам
  const groupByMonth = (ordersArr: typeof orders) => {
    const byMonth: Record<string, typeof orders> = {};
    ordersArr.forEach(order => {
      const month = order.date.slice(0, 7); // YYYY-MM
      if (!byMonth[month]) byMonth[month] = [];
      byMonth[month].push(order);
    });
    return byMonth;
  };
  const ordersByMonth = groupByMonth(orders);
  const months = Object.keys(ordersByMonth).sort();
  const lastMonth = months[months.length - 1];
  const prevMonth = months[months.length - 2];

  // Метрики по месяцам
  const calcMonthStats = (month: string | undefined) => {
    if (!month) return { revenue: 0, orders: 0, customers: 0, avgOrder: 0 };
    const monthOrders = ordersByMonth[month] || [];
    const revenue = monthOrders.reduce((sum, o) => sum + o.total, 0);
    const ordersCount = monthOrders.length;
    const customerIds = new Set(monthOrders.map(o => o.customer));
    const customersCount = customerIds.size;
    const avgOrder = ordersCount ? Math.round(revenue / ordersCount) : 0;
    return { revenue, orders: ordersCount, customers: customersCount, avgOrder };
  };
  const currentMonth = calcMonthStats(lastMonth);
  const previousMonth = calcMonthStats(prevMonth);

  // Динамика продаж (по месяцам)
  const salesData = months.map(month => ({
    month,
    sales: ordersByMonth[month].reduce((sum, o) => sum + o.total, 0),
    orders: ordersByMonth[month].length
  }));

  // Продажи по категориям
  const categoryCount: Record<string, number> = {};
  orders.forEach(order => {
    if (Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        const product = products.find(p => p.name === item.name);
        const category = product?.category || 'Прочее';
        categoryCount[category] = (categoryCount[category] || 0) + (item.quantity || 1);
      });
    }
  });
  const totalCategory = Object.values(categoryCount).reduce((a, b) => a + b, 0) || 1;
  const categoryData = Object.entries(categoryCount).map(([name, value], i) => ({
    name,
    value: Math.round((value / totalCategory) * 100),
    color: ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"][i % 5]
  }));

  // Топ товаров по продажам
  const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
  orders.forEach(order => {
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

  const getChangePercent = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getChangeIcon = (current: number, previous: number) => {
    return current > previous ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getChangeColor = (current: number, previous: number) => {
    return current > previous ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Отчеты и аналитика</h1>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">За неделю</SelectItem>
              <SelectItem value="month">За месяц</SelectItem>
              <SelectItem value="quarter">За квартал</SelectItem>
              <SelectItem value="year">За год</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выручка</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonth.revenue.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {getChangeIcon(currentMonth.revenue, previousMonth.revenue)}
              <span className={`ml-1 ${getChangeColor(currentMonth.revenue, previousMonth.revenue)}`}>
                {getChangePercent(currentMonth.revenue, previousMonth.revenue)}%
              </span>
              <span className="ml-1">к прошлому месяцу</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заказы</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonth.orders}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {getChangeIcon(currentMonth.orders, previousMonth.orders)}
              <span className={`ml-1 ${getChangeColor(currentMonth.orders, previousMonth.orders)}`}>
                {getChangePercent(currentMonth.orders, previousMonth.orders)}%
              </span>
              <span className="ml-1">к прошлому месяцу</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Клиенты</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonth.customers}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {getChangeIcon(currentMonth.customers, previousMonth.customers)}
              <span className={`ml-1 ${getChangeColor(currentMonth.customers, previousMonth.customers)}`}>
                {getChangePercent(currentMonth.customers, previousMonth.customers)}%
              </span>
              <span className="ml-1">к прошлому месяцу</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonth.avgOrder.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {getChangeIcon(currentMonth.avgOrder, previousMonth.avgOrder)}
              <span className={`ml-1 ${getChangeColor(currentMonth.avgOrder, previousMonth.avgOrder)}`}>
                {getChangePercent(currentMonth.avgOrder, previousMonth.avgOrder)}%
              </span>
              <span className="ml-1">к прошлому месяцу</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Динамика продаж</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Продажи по категориям</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Топ товаров */}
      <Card>
        <CardHeader>
          <CardTitle>Топ товаров по продажам</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Товар</TableHead>
                <TableHead>Продано штук</TableHead>
                <TableHead>Выручка</TableHead>
                <TableHead>Рейтинг</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product, index) => (
                <TableRow key={product.name}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sales}</TableCell>
                  <TableCell>{product.revenue.toLocaleString()} ₽</TableCell>
                  <TableCell>
                    <Badge variant={index < 3 ? "default" : "secondary"}>
                      #{index + 1}
                    </Badge>
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