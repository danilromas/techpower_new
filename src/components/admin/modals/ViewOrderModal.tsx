import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, User, MapPin, Phone, Calendar, DollarSign } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  phone: string;
  city: string;
  total: number;
  status: string;
  date: string;
  items: number;
  manager: string;
}

interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const orderItems = [
  { name: 'AMD Ryzen 7 5800X', category: 'Процессор', price: 25000, quantity: 1 },
  { name: 'NVIDIA GeForce RTX 4070', category: 'Видеокарта', price: 65000, quantity: 1 },
  { name: 'ASUS ROG STRIX B550-F', category: 'Материнская плата', price: 18000, quantity: 1 },
  { name: 'Corsair Vengeance 32GB DDR4', category: 'Оперативная память', price: 12000, quantity: 1 },
  { name: 'Samsung 980 PRO 1TB NVMe', category: 'Накопитель', price: 15000, quantity: 1 },
];

export function ViewOrderModal({ isOpen, onClose, order }: ViewOrderModalProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Заказ {order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Информация о клиенте */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Информация о клиенте
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Имя:</span>
                <span className="font-medium">{order.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Телефон:</span>
                <span className="font-medium">{order.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Город:</span>
                <span className="font-medium">{order.city}</span>
              </div>
            </div>
          </div>

          {/* Информация о заказе */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Информация о заказе
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата:</span>
                <span className="font-medium">{order.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Статус:</span>
                <Badge variant="secondary">{order.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Менеджер:</span>
                <span className="font-medium">{order.manager}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Товары в заказе */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Товары в заказе</h3>
          <div className="space-y-2">
            {orderItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
                <div className="text-center min-w-[80px]">
                  <p className="text-sm text-muted-foreground">Кол-во</p>
                  <p className="font-medium">{item.quantity}</p>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="text-sm text-muted-foreground">Цена</p>
                  <p className="font-medium">{item.price.toLocaleString()} ₽</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Итого */}
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Итого к оплате:</span>
          <span className="text-primary">{order.total.toLocaleString()} ₽</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}