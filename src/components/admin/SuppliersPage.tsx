import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Building, Phone, Mail, Plus } from 'lucide-react';

const mockSuppliers = [
  {
    id: 1,
    name: 'DNS',
    contact: 'Иванов И.И.',
    phone: '+7 (495) 123-45-67',
    email: 'dns@example.com',
    address: 'Москва, ул. Ленина, 1',
    rating: 4.8,
    deliveryTime: '1-2 дня',
    paymentTerms: '30 дней',
    status: 'Активный'
  },
  {
    id: 2,
    name: 'Ситилинк',
    contact: 'Петров П.П.',
    phone: '+7 (495) 234-56-78',
    email: 'citilink@example.com',
    address: 'СПб, Невский пр., 10',
    rating: 4.5,
    deliveryTime: '2-3 дня',
    paymentTerms: '14 дней',
    status: 'Активный'
  },
  {
    id: 3,
    name: 'Regard',
    contact: 'Сидоров С.С.',
    phone: '+7 (495) 345-67-89',
    email: 'regard@example.com',
    address: 'Москва, ул. Тверская, 5',
    rating: 4.2,
    deliveryTime: '3-5 дней',
    paymentTerms: '21 день',
    status: 'Неактивный'
  }
];

const mockDeliveries = [
  { id: 1, supplier: 'DNS', orderDate: '2024-01-15', expectedDate: '2024-01-17', status: 'В пути', amount: 125000 },
  { id: 2, supplier: 'Ситилинк', orderDate: '2024-01-14', expectedDate: '2024-01-16', status: 'Доставлено', amount: 87500 },
  { id: 3, supplier: 'DNS', orderDate: '2024-01-12', expectedDate: '2024-01-15', status: 'Просрочено', amount: 65000 }
];

export function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('suppliers');

  const filteredSuppliers = mockSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Активный':
        return <Badge variant="default">Активный</Badge>;
      case 'Неактивный':
        return <Badge variant="secondary">Неактивный</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case 'Доставлено':
        return <Badge variant="default">Доставлено</Badge>;
      case 'В пути':
        return <Badge variant="secondary">В пути</Badge>;
      case 'Просрочено':
        return <Badge variant="destructive">Просрочено</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Поставщики</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Добавить поставщика
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего поставщиков</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSuppliers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активных поставщиков</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSuppliers.filter(s => s.status === 'Активный').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сумма заказов в месяц</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDeliveries.reduce((sum, d) => sum + d.amount, 0).toLocaleString()} ₽
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Табы */}
      <div className="flex space-x-4 border-b">
        <Button
          variant={activeTab === 'suppliers' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('suppliers')}
        >
          Поставщики
        </Button>
        <Button
          variant={activeTab === 'deliveries' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('deliveries')}
        >
          Поставки
        </Button>
      </div>

      {/* Поиск */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск поставщиков..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Контент табов */}
      {activeTab === 'suppliers' && (
        <Card>
          <CardHeader>
            <CardTitle>Список поставщиков</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Контактное лицо</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Рейтинг</TableHead>
                  <TableHead>Доставка</TableHead>
                  <TableHead>Оплата</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {supplier.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {supplier.email}
                      </div>
                    </TableCell>
                    <TableCell>{supplier.rating}/5</TableCell>
                    <TableCell>{supplier.deliveryTime}</TableCell>
                    <TableCell>{supplier.paymentTerms}</TableCell>
                    <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'deliveries' && (
        <Card>
          <CardHeader>
            <CardTitle>Текущие поставки</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Поставщик</TableHead>
                  <TableHead>Дата заказа</TableHead>
                  <TableHead>Ожидаемая дата</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.supplier}</TableCell>
                    <TableCell>{delivery.orderDate}</TableCell>
                    <TableCell>{delivery.expectedDate}</TableCell>
                    <TableCell>{delivery.amount.toLocaleString()} ₽</TableCell>
                    <TableCell>{getDeliveryStatusBadge(delivery.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}