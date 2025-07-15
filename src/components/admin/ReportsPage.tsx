import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Download, FileText } from 'lucide-react';

const salesData = [
  { month: 'Янв', sales: 450000, orders: 25 },
  { month: 'Фев', sales: 520000, orders: 30 },
  { month: 'Мар', sales: 680000, orders: 38 },
  { month: 'Апр', sales: 750000, orders: 42 },
  { month: 'Май', sales: 890000, orders: 48 },
  { month: 'Июн', sales: 920000, orders: 52 }
];

const categoryData = [
  { name: 'Процессоры', value: 35, color: '#8884d8' },
  { name: 'Видеокарты', value: 25, color: '#82ca9d' },
  { name: 'Память', value: 15, color: '#ffc658' },
  { name: 'Накопители', value: 12, color: '#ff7300' },
  { name: 'Прочее', value: 13, color: '#00ff00' }
];

const topProducts = [
  { name: 'Intel Core i5-13400F', sales: 45, revenue: 810000 },
  { name: 'RTX 4060 Ti', sales: 32, revenue: 1440000 },
  { name: 'DDR4 16GB Corsair', sales: 67, revenue: 402000 },
  { name: 'Samsung 980 Pro 1TB', sales: 38, revenue: 304000 },
  { name: 'Corsair RM750x', sales: 28, revenue: 336000 }
];

export function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('sales');

  const currentMonth = {
    revenue: 920000,
    orders: 52,
    customers: 38,
    avgOrder: 17692
  };

  const previousMonth = {
    revenue: 890000,
    orders: 48,
    customers: 35,
    avgOrder: 18542
  };

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