import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  AlertCircle,
  CheckCircle,
  DollarSign,
  Save,
  X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatePCBuildModal } from './modals/CreatePCBuildModal';
import { SellBuildModal } from './modals/SellBuildModal';
import { pcbuildsApi } from '@/api';
import { ordersApi } from '@/api';

interface PCBuild {
  id: number;
  name: string;
  description: string;
  components: any[];
  totalPrice: number;
  markup: number;
  markupType: 'percentage' | 'fixed';
  finalPrice: number;
  profit: number;
  createdAt: string;
  status: 'draft' | 'published' | 'archived';
  isCompatible: boolean;
}

const statusLabels = {
  draft: 'Черновик',
  published: 'Опубликовано',
  archived: 'В архиве'
};

export function PCBuilderPage() {
  const [builds, setBuilds] = useState<PCBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedBuildForSale, setSelectedBuildForSale] = useState<PCBuild | null>(null);
  const [editingPrices, setEditingPrices] = useState<{[key: number]: boolean}>({});
  const [tempMarkup, setTempMarkup] = useState<{[key: number]: {value: number, type: 'percentage' | 'fixed'}}>({});

  // Загрузка сборок с сервера
  useEffect(() => {
    setLoading(true);
    pcbuildsApi.getAll()
      .then((data) => {
        setBuilds(data);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredBuilds = builds.filter(build => {
    const matchesSearch = build.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         build.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || build.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const calculatePrices = (totalPrice: number, markup: number, markupType: 'percentage' | 'fixed') => {
    const finalPrice = markupType === 'percentage' 
      ? totalPrice + (totalPrice * markup / 100)
      : totalPrice + markup;
    const profit = finalPrice - totalPrice;
    return { finalPrice, profit };
  };

  const handleCreateBuild = async (buildData: any) => {
    try {
      await pcbuildsApi.add(buildData);
      // Перезагрузить список после добавления
      const data = await pcbuildsApi.getAll();
      setBuilds(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEditPrices = (buildId: number) => {
    const build = builds.find(b => b.id === buildId);
    if (build) {
      setTempMarkup({
        ...tempMarkup,
        [buildId]: { value: build.markup, type: build.markupType }
      });
      setEditingPrices({ ...editingPrices, [buildId]: true });
    }
  };

  const handleSavePrices = async (buildId: number) => {
    const markup = tempMarkup[buildId];
    if (!markup) return;
    const build = builds.find(b => b.id === buildId);
    if (!build) return;
    try {
      await pcbuildsApi.update(buildId, {
        ...build,
        markup: markup.value,
        markupType: markup.type,
      });
      const data = await pcbuildsApi.getAll();
      setBuilds(data);
    } catch (e: any) {
      setError(e.message);
    }
    setEditingPrices({ ...editingPrices, [buildId]: false });
    const newTempMarkup = { ...tempMarkup };
    delete newTempMarkup[buildId];
    setTempMarkup(newTempMarkup);
  };

  const handleCancelEditPrices = (buildId: number) => {
    setEditingPrices({ ...editingPrices, [buildId]: false });
    const newTempMarkup = { ...tempMarkup };
    delete newTempMarkup[buildId];
    setTempMarkup(newTempMarkup);
  };

  const handleSellBuild = (build: PCBuild) => {
    setSelectedBuildForSale(build);
    setIsSellModalOpen(true);
  };

  const handleBuildSold = async (customerId: number, buildId: number, customerData: any, storeId: number) => {
    if (!selectedBuildForSale) return;
    try {
      // Формируем заказ
      const orderData = {
        customer: customerData.name,
        phone: customerData.phone,
        city: customerData.city,
        manager: '', // Можно добавить текущего пользователя, если есть
        items: selectedBuildForSale.components.map((c: any) => ({
          id: c.component.id,
          name: c.component.name,
          price: c.component.price,
          quantity: 1
        })),
        total: selectedBuildForSale.finalPrice,
        notes: `Продажа сборки ПК: ${selectedBuildForSale.name} (buildId: ${selectedBuildForSale.id})\nМагазин: ${storeId}`
      };
      await ordersApi.add(orderData);
      alert(`Сборка "${selectedBuildForSale.name}" продана клиенту ${customerData.name} и заказ создан!`);
      setIsSellModalOpen(false);
    } catch (e: any) {
      alert('Ошибка при создании заказа: ' + e.message);
    }
  };

  const handlePublishBuild = async (buildId: number) => {
    const build = builds.find(b => b.id === buildId);
    if (!build) return;
    try {
      await pcbuildsApi.update(buildId, { ...build, status: 'published' });
      const data = await pcbuildsApi.getAll();
      setBuilds(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleArchiveBuild = async (buildId: number) => {
    const build = builds.find(b => b.id === buildId);
    if (!build) return;
    try {
      await pcbuildsApi.update(buildId, { ...build, status: 'archived' });
      const data = await pcbuildsApi.getAll();
      setBuilds(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDeleteBuild = async (buildId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту сборку?')) return;
    try {
      await pcbuildsApi.delete(buildId);
      setBuilds(builds.filter(build => build.id !== buildId));
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Корректный возврат JSX
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Сборка ПК</h1>
          <p className="text-gray-600 mt-1">Создание и управление конфигурациями ПК</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Создать сборку
        </Button>
      </div>
      {/* Фильтры */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Поиск по названию или описанию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Все статусы</option>
              <option value="draft">Черновик</option>
              <option value="published">Опубликовано</option>
              <option value="archived">В архиве</option>
            </select>
          </div>
        </CardContent>
      </Card>
      {/* Таблица сборок */}
      <Card>
        <CardHeader>
          <CardTitle>Список сборок</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Название</th>
                  <th className="text-left py-3 px-4">Описание</th>
                  <th className="text-left py-3 px-4">Цена комплектующих</th>
                  <th className="text-left py-3 px-4">Наценка</th>
                  <th className="text-left py-3 px-4">Цена продажи</th>
                  <th className="text-left py-3 px-4">Прибыль</th>
                  <th className="text-left py-3 px-4">Дата</th>
                  <th className="text-left py-3 px-4">Статус</th>
                  <th className="text-left py-3 px-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center">Загрузка...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-red-600">{error}</td>
                  </tr>
                ) : filteredBuilds.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center">Сборок не найдено.</td>
                  </tr>
                ) : filteredBuilds.map((build) =>
                  <tr key={build.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{build.name}</div>
                        {build.isCompatible ? (
                          <div className="flex items-center gap-1 text-green-600 text-xs">
                            <CheckCircle className="h-3 w-3" />
                            Совместимо
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            Несовместимо
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {build.description}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{build.totalPrice.toLocaleString()} ₽</div>
                      </td>
                      <td className="py-3 px-4">
                        {editingPrices[build.id] ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={tempMarkup[build.id]?.value || 0}
                              onChange={(e) => setTempMarkup({
                                ...tempMarkup,
                                [build.id]: {
                                  ...tempMarkup[build.id],
                                  value: Number(e.target.value)
                                }
                              })}
                              className="w-20"
                            />
                            <Select
                              value={tempMarkup[build.id]?.type || 'percentage'}
                              onValueChange={(value: 'percentage' | 'fixed') => setTempMarkup({
                                ...tempMarkup,
                                [build.id]: {
                                  ...tempMarkup[build.id],
                                  type: value
                                }
                              })}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">%</SelectItem>
                                <SelectItem value="fixed">₽</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button size="sm" onClick={() => handleSavePrices(build.id)}>
                              <Save className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleCancelEditPrices(build.id)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {build.markup} {build.markupType === 'percentage' ? '%' : '₽'}
                            </span>
                            <Button size="sm" variant="ghost" onClick={() => handleEditPrices(build.id)}>
                              <DollarSign className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-green-600">{build.finalPrice.toLocaleString()} ₽</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-blue-600">+{build.profit.toLocaleString()} ₽</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {build.createdAt}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={build.status === 'published' ? 'default' : 'secondary'}>
                          {statusLabels[build.status]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {build.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePublishBuild(build.id)}
                              className="gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Опубликовать
                            </Button>
                          )}
                          
                          {build.status === 'published' && build.isCompatible && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleSellBuild(build)}
                              className="gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              Продать
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Изменить
                          </Button>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteBuild(build.id)}
                            className="gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Удалить
                          </Button>
                        </div>
                      </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Модальное окно создания сборки */}
      <CreatePCBuildModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateBuild}
      />
      {/* Модальное окно продажи сборки */}
      <SellBuildModal
        open={isSellModalOpen}
        onOpenChange={setIsSellModalOpen}
        build={selectedBuildForSale}
        onSell={handleBuildSold}
      />
    </div>
  );
}
