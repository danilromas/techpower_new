import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, CreditCard, Banknote, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const cashFlowData = [
  { month: 'Янв', income: 450000, expenses: 320000, profit: 130000 },
  { month: 'Фев', income: 520000, expenses: 350000, profit: 170000 },
  { month: 'Мар', income: 680000, expenses: 420000, profit: 260000 },
  { month: 'Апр', income: 750000, expenses: 480000, profit: 270000 },
  { month: 'Май', income: 890000, expenses: 540000, profit: 350000 },
  { month: 'Июн', income: 920000, expenses: 580000, profit: 340000 }
];

const transactions = [
  { id: 1, type: 'income', description: 'Продажа ПК Intel Core i5', amount: 65000, date: '2024-01-15', category: 'Продажи' },
  { id: 2, type: 'expense', description: 'Закупка комплектующих у DNS', amount: -45000, date: '2024-01-14', category: 'Закупки' },
  { id: 3, type: 'income', description: 'Продажа видеокарты RTX 4060', amount: 42000, date: '2024-01-14', category: 'Продажи' },
  { id: 4, type: 'expense', description: 'Аренда склада', amount: -25000, date: '2024-01-13', category: 'Операционные' },
  { id: 5, type: 'expense', description: 'Зарплата сотрудников', amount: -120000, date: '2024-01-10', category: 'Зарплата' },
  { id: 6, type: 'income', description: 'Продажа игрового ПК', amount: 95000, date: '2024-01-09', category: 'Продажи' }
];

const expenses = [
  { category: 'Закупки', amount: 450000, percentage: 55 },
  { category: 'Зарплата', amount: 180000, percentage: 22 },
  { category: 'Аренда', amount: 75000, percentage: 9 },
  { category: 'Маркетинг', amount: 60000, percentage: 7 },
  { category: 'Прочие', amount: 55000, percentage: 7 }
];

export function FinancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTransactions = selectedCategory === 'all' 
    ? transactions 
    : transactions.filter(t => t.category === selectedCategory);

  const currentMonth = {
    income: 920000,
    expenses: 580000,
    profit: 340000,
    profitMargin: 37
  };

  const getTransactionIcon = (type: string) => {
    return type === 'income' 
      ? <ArrowUpRight className="h-4 w-4 text-green-500" />
      : <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  const getTransactionBadge = (type: string) => {
    return type === 'income' 
      ? <Badge variant="default">Доход</Badge>
      : <Badge variant="destructive">Расход</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Финансы</h1>
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
      </div>

      {/* Основные финансовые показатели */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Доходы</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{currentMonth.income.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground">+12% к прошлому месяцу</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Расходы</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{currentMonth.expenses.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground">+8% к прошлому месяцу</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Прибыль</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonth.profit.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground">+18% к прошлому месяцу</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Рентабельность</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonth.profitMargin}%</div>
            <p className="text-xs text-muted-foreground">+2% к прошлому месяцу</p>
          </CardContent>
        </Card>
      </div>

      {/* График денежного потока */}
      <Card>
        <CardHeader>
          <CardTitle>Денежный поток</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} name="Доходы" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Расходы" />
              <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="Прибыль" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Структура расходов */}
        <Card>
          <CardHeader>
            <CardTitle>Структура расходов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{expense.category}</span>
                      <span className="text-sm text-muted-foreground">{expense.percentage}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${expense.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">{expense.amount.toLocaleString()} ₽</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Последние транзакции */}
        <Card>
          <CardHeader>
            <CardTitle>Последние транзакции</CardTitle>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="Продажи">Продажи</SelectItem>
                <SelectItem value="Закупки">Закупки</SelectItem>
                <SelectItem value="Операционные">Операционные</SelectItem>
                <SelectItem value="Зарплата">Зарплата</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.slice(0, 6).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount.toLocaleString()} ₽
                    </p>
                    {getTransactionBadge(transaction.type)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}