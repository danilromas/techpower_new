import React, { useState } from 'react';
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
import { getPCBuilds, setPCBuilds, addPCBuild, updatePCBuild, deletePCBuild } from "@/api/pcbuildsApi";
import { addOrder } from "@/api/ordersApi";

export interface PCBuild {
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

const mockBuilds: PCBuild[] = [
  {
    id: 1,
    name: 'Сборка для игр 2024',
    description: 'Отличная сборка для современных игр',
    components: [
      { type: 'cpu', component: { id: 1, name: 'Intel Core i5-13600K', price: 25000 } },
      { type: 'gpu', component: { id: 4, name: 'RTX 4070', price: 55000 } },
      { type: 'ram', component: { id: 7, name: 'Corsair 16GB DDR4-3200', price: 6000 } },
      { type: 'motherboard', component: { id: 10, name: 'ASUS Z790-P', price: 18000 } },
      { type: 'storage', component: { id: 19, name: 'Samsung 980 Pro 1TB NVMe', price: 8000 } },
      { type: 'psu', component: { id: 13, name: 'Corsair RM750x', price: 12000 } },
      { type: 'cooler', component: { id: 22, name: 'Noctua NH-D15', price: 7000 } },
      { type: 'case', component: { id: 16, name: 'Fractal Design Define 7', price: 15000 } }
    ],
    totalPrice: 146000,
    markup: 15,
    markupType: 'percentage' as const,
    finalPrice: 167900,
    profit: 21900,
    createdAt: '2024-01-10',
    status: 'published' as const,
    isCompatible: true
  },
  {
    id: 2,
    name: 'Бюджетная сборка',
    description: 'Сборка для работы и учебы',
    components: [
      { type: 'cpu', component: { id: 2, name: 'AMD Ryzen 5 7600X', price: 23000 } },
      { type: 'gpu', component: { id: 5, name: 'RTX 4060', price: 35000 } },
      { type: 'ram', component: { id: 8, name: 'G.Skill 32GB DDR5-5600', price: 15000 } },
      { type: 'motherboard', component: { id: 11, name: 'MSI B650M Pro', price: 12000 } },
      { type: 'storage', component: { id: 20, name: 'Kingston NV2 500GB', price: 4000 } },
      { type: 'psu', component: { id: 14, name: 'EVGA 650W Gold', price: 8000 } },
      { type: 'cooler', component: { id: 23, name: 'be quiet! Pure Rock 2', price: 3500 } },
      { type: 'case', component: { id: 17, name: 'NZXT H7 Flow', price: 12000 } }
    ],
    totalPrice: 112500,
    markup: 10000,
    markupType: 'fixed' as const,
    finalPrice: 122500,
    profit: 10000,
    createdAt: '2024-01-05',
    status: 'published' as const,
    isCompatible: true
  }
];

const statusLabels = {
  draft: 'Черновик',
  published: 'Опубликовано',
  archived: 'В архиве'
};

export function PCBuilderPage() {
  const [builds, setBuilds] = useState<PCBuild[]>(getPCBuilds());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedBuildForSale, setSelectedBuildForSale] = useState<PCBuild | null>(null);
  const [editingPrices, setEditingPrices] = useState<{[key: number]: boolean}>({});
  const [tempMarkup, setTempMarkup] = useState<{[key: number]: {value: number, type: 'percentage' | 'fixed'}}>({});

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

  const handleCreateBuild = (buildData: any) => {
    const { finalPrice, profit } = calculatePrices(buildData.totalPrice, buildData.markup, buildData.markupType);
    const newBuild = {
      ...buildData,
      finalPrice,
      profit,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft' as const
    };
    addPCBuild(newBuild);
    setBuilds(getPCBuilds());
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

  const handleSavePrices = (buildId: number) => {
    const markup = tempMarkup[buildId];
    if (!markup) return;

    setBuilds(prevBuilds =>
      prevBuilds.map(build => {
        if (build.id === buildId) {
          const { finalPrice, profit } = calculatePrices(build.totalPrice, markup.value, markup.type);
          return {
            ...build,
            markup: markup.value,
            markupType: markup.type,
            finalPrice,
            profit
          };
        }
        return build;
      })
    );
    
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

  const handleBuildSold = (customerId: number, buildId: number, customerData: any, storeId: number) => {
    const build = builds.find(b => b.id === buildId);
    if (!build) return;
    // Формируем заказ
    const order = {
      customer: customerData.name,
      phone: customerData.phone || '',
      city: customerData.city || '',
      manager: '',
      items: build.components.length,
      total: build.finalPrice,
      status: 'Принят',
      date: new Date().toISOString().split('T')[0],
    };
    addOrder(order);
    alert(`Сборка "${build.name}" продана клиенту ${customerData.name}. Заказ создан!`);
  };

  const handlePublishBuild = (buildId: number) => {
    setBuilds(builds.map(build => 
      build.id === buildId 
        ? { ...build, status: 'published' as const }
        : build
    ));
  };

  const handleArchiveBuild = (buildId: number) => {
    setBuilds(builds.map(build => 
      build.id === buildId 
        ? { ...build, status: 'archived' as const }
        : build
    ));
  };

  const handleDeleteBuild = (buildId: number) => {
    if (confirm('Вы уверены, что хотите удалить эту сборку?')) {
      deletePCBuild(buildId);
      setBuilds(getPCBuilds());
    }
  };

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
                {filteredBuilds.map((build) => (
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
                ))}
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
