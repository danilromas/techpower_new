import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, AlertCircle, CheckCircle, Calculator } from 'lucide-react';

interface CreatePCBuildModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (buildData: {
    name: string;
    description: string;
    components: any[];
    totalPrice: number;
    markup: number;
    markupType: 'percentage' | 'fixed';
    isCompatible: boolean;
  }) => void;
}

const mockComponents = {
  cpu: [
    { id: 1, name: 'Intel Core i5-13600K', price: 25000, socket: 'LGA1700' },
    { id: 2, name: 'AMD Ryzen 5 7600X', price: 23000, socket: 'AM5' },
    { id: 3, name: 'Intel Core i7-13700K', price: 35000, socket: 'LGA1700' }
  ],
  gpu: [
    { id: 4, name: 'RTX 4070', price: 55000, power: 200 },
    { id: 5, name: 'RTX 4060', price: 35000, power: 115 },
    { id: 6, name: 'RX 7800 XT', price: 50000, power: 263 }
  ],
  ram: [
    { id: 7, name: 'Corsair 16GB DDR4-3200', price: 6000, type: 'DDR4', capacity: 16 },
    { id: 8, name: 'G.Skill 32GB DDR5-5600', price: 15000, type: 'DDR5', capacity: 32 },
    { id: 9, name: 'Kingston 16GB DDR5-4800', price: 8000, type: 'DDR5', capacity: 16 }
  ],
  motherboard: [
    { id: 10, name: 'ASUS Z790-P', price: 18000, socket: 'LGA1700', ramType: 'DDR5' },
    { id: 11, name: 'MSI B650M Pro', price: 12000, socket: 'AM5', ramType: 'DDR5' },
    { id: 12, name: 'Gigabyte B760M DS3H', price: 8000, socket: 'LGA1700', ramType: 'DDR4' }
  ],
  storage: [
    { id: 19, name: 'Samsung 980 Pro 1TB NVMe', price: 8000, type: 'NVMe SSD', capacity: 1000 },
    { id: 20, name: 'Kingston NV2 500GB', price: 4000, type: 'NVMe SSD', capacity: 500 },
    { id: 21, name: 'Seagate Barracuda 1TB HDD', price: 3500, type: 'HDD', capacity: 1000 }
  ],
  psu: [
    { id: 13, name: 'Corsair RM750x', price: 12000, power: 750 },
    { id: 14, name: 'EVGA 650W Gold', price: 8000, power: 650 },
    { id: 15, name: 'Seasonic Focus 850W', price: 15000, power: 850 }
  ],
  cooler: [
    { id: 22, name: 'Noctua NH-D15', price: 7000, type: 'Air', socket: ['LGA1700', 'AM5'] },
    { id: 23, name: 'be quiet! Pure Rock 2', price: 3500, type: 'Air', socket: ['LGA1700', 'AM5'] },
    { id: 24, name: 'Corsair H100i RGB', price: 12000, type: 'AIO', socket: ['LGA1700', 'AM5'] }
  ],
  case: [
    { id: 16, name: 'Fractal Design Define 7', price: 15000 },
    { id: 17, name: 'NZXT H7 Flow', price: 12000 },
    { id: 18, name: 'Cooler Master MasterBox Q300L', price: 4000 }
  ]
};

export function CreatePCBuildModal({ open, onOpenChange, onSubmit }: CreatePCBuildModalProps) {
  const [buildName, setBuildName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedComponents, setSelectedComponents] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [markup, setMarkup] = useState(15);
  const [markupType, setMarkupType] = useState<'percentage' | 'fixed'>('percentage');

  const componentTypes = [
    { key: 'cpu', label: 'Процессор', required: true },
    { key: 'motherboard', label: 'Материнская плата', required: true },
    { key: 'ram', label: 'Оперативная память', required: true },
    { key: 'gpu', label: 'Видеокарта', required: true },
    { key: 'storage', label: 'Накопитель', required: true },
    { key: 'psu', label: 'Блок питания', required: true },
    { key: 'cooler', label: 'Кулер', required: true },
    { key: 'case', label: 'Корпус', required: true }
  ];

  const handleComponentSelect = (type: string, component: any) => {
    setSelectedComponents(prev => ({
      ...prev,
      [type]: component
    }));
  };

  const handleComponentRemove = (type: string) => {
    setSelectedComponents(prev => {
      const newComponents = { ...prev };
      delete newComponents[type];
      return newComponents;
    });
  };

  const checkCompatibility = () => {
    const issues = [];
    
    if (selectedComponents.cpu && selectedComponents.motherboard) {
      if (selectedComponents.cpu.socket !== selectedComponents.motherboard.socket) {
        issues.push('Процессор и материнская плата имеют разные сокеты');
      }
    }

    if (selectedComponents.ram && selectedComponents.motherboard) {
      if (selectedComponents.ram.type !== selectedComponents.motherboard.ramType) {
        issues.push('Тип памяти не совместим с материнской платой');
      }
    }

    if (selectedComponents.psu && selectedComponents.gpu) {
      const totalPower = selectedComponents.gpu.power + 150;
      if (selectedComponents.psu.power < totalPower) {
        issues.push('Недостаточная мощность блока питания');
      }
    }

    if (selectedComponents.cpu && selectedComponents.cooler) {
      if (selectedComponents.cooler.socket && !selectedComponents.cooler.socket.includes(selectedComponents.cpu.socket)) {
        issues.push('Кулер не совместим с сокетом процессора');
      }
    }

    return issues;
  };

  const getTotalPrice = () => {
    return Object.values(selectedComponents).reduce((total: number, component: any) => {
      return total + (component?.price || 0);
    }, 0);
  };

  const calculateFinalPrice = () => {
    const total = getTotalPrice();
    return markupType === 'percentage' 
      ? total + (total * markup / 100)
      : total + markup;
  };

  const calculateProfit = () => {
    return calculateFinalPrice() - getTotalPrice();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!buildName.trim()) {
      newErrors.buildName = 'Название сборки обязательно';
    }

    componentTypes.forEach(type => {
      if (type.required && !selectedComponents[type.key]) {
        newErrors[type.key] = `${type.label} обязателен`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const compatibilityIssues = checkCompatibility();
    const isCompatible = compatibilityIssues.length === 0;

    onSubmit({
      name: buildName,
      description,
      components: Object.entries(selectedComponents).map(([type, component]) => ({
        type,
        component
      })),
      totalPrice: getTotalPrice(),
      markup,
      markupType,
      isCompatible
    });

    handleClose();
  };

  const handleClose = () => {
    setBuildName('');
    setDescription('');
    setSelectedComponents({});
    setErrors({});
    setMarkup(15);
    setMarkupType('percentage');
    onOpenChange(false);
  };

  const compatibilityIssues = checkCompatibility();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать сборку ПК</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buildName">Название сборки</Label>
              <Input
                id="buildName"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder="Введите название сборки"
              />
              {errors.buildName && <p className="text-sm text-red-600">{errors.buildName}</p>}
            </div>

            <div className="space-y-2">
              <Label>Себестоимость</Label>
              <div className="px-3 py-2 bg-muted rounded-md text-lg font-semibold">
                {getTotalPrice().toLocaleString()} ₽
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание сборки (необязательно)"
              rows={2}
            />
          </div>

          {/* Компоненты */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Компоненты</h3>
            
            {componentTypes.map((type) => (
              <div key={type.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Label>{type.label}</Label>
                    {type.required && <Badge variant="secondary">Обязательно</Badge>}
                  </div>
                  {selectedComponents[type.key] && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleComponentRemove(type.key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {selectedComponents[type.key] ? (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium">{selectedComponents[type.key].name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedComponents[type.key].price.toLocaleString()} ₽
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mockComponents[type.key as keyof typeof mockComponents]?.map((component) => (
                      <div
                        key={component.id}
                        className="flex items-center justify-between p-2 border rounded hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleComponentSelect(type.key, component)}
                      >
                        <div>
                          <div className="font-medium">{component.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {component.price.toLocaleString()} ₽
                          </div>
                        </div>
                        <Button type="button" variant="outline" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {errors[type.key] && <p className="text-sm text-red-600 mt-2">{errors[type.key]}</p>}
              </div>
            ))}
          </div>

          {/* Проверка совместимости */}
          {Object.keys(selectedComponents).length > 1 && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {compatibilityIssues.length === 0 ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-600">Компоненты совместимы</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-600">Проблемы совместимости</span>
                  </>
                )}
              </div>
              {compatibilityIssues.length > 0 && (
                <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                  {compatibilityIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Наценка и расчет цены */}
          {getTotalPrice() > 0 && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Расчет цены и прибыли
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="markup">Наценка</Label>
                  <div className="flex gap-2">
                    <Input
                      id="markup"
                      type="number"
                      value={markup}
                      onChange={(e) => setMarkup(Number(e.target.value))}
                      placeholder="Введите наценку"
                    />
                    <Select value={markupType} onValueChange={(value: 'percentage' | 'fixed') => setMarkupType(value)}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">%</SelectItem>
                        <SelectItem value="fixed">₽</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Себестоимость</p>
                  <p className="text-lg font-semibold">{getTotalPrice().toLocaleString()} ₽</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Цена продажи</p>
                  <p className="text-lg font-semibold text-green-600">{Math.round(calculateFinalPrice()).toLocaleString()} ₽</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Чистая прибыль</p>
                  <p className="text-lg font-semibold text-blue-600">+{Math.round(calculateProfit()).toLocaleString()} ₽</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              Создать сборку
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}