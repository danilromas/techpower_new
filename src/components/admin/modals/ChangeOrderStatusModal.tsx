import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  status: string;
}

interface ChangeOrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusChange: (orderId: string, newStatus: string, comment: string) => void;
}

const statusOptions = [
  { value: 'Принят', label: 'Принят', icon: Clock, color: 'bg-blue-100 text-blue-800' },
  { value: 'В сборке', label: 'В сборке', icon: Package, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Доставка', label: 'Доставка', icon: Truck, color: 'bg-purple-100 text-purple-800' },
  { value: 'Завершен', label: 'Завершен', icon: CheckCircle2, color: 'bg-green-100 text-green-800' },
  { value: 'Отмена', label: 'Отмена', icon: AlertCircle, color: 'bg-red-100 text-red-800' },
];

export function ChangeOrderStatusModal({ isOpen, onClose, order, onStatusChange }: ChangeOrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!order || !selectedStatus) return;
    
    onStatusChange(order.id, selectedStatus, comment);
    onClose();
    setSelectedStatus('');
    setComment('');
  };

  const handleClose = () => {
    onClose();
    setSelectedStatus('');
    setComment('');
  };

  if (!order) return null;

  const currentStatus = statusOptions.find(s => s.value === order.status);
  const CurrentIcon = currentStatus?.icon || Clock;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Изменить статус заказа</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Заказ</Label>
            <p className="text-lg font-semibold">{order.id}</p>
            <p className="text-sm text-muted-foreground">{order.customer}</p>
          </div>

          <div>
            <Label className="text-sm font-medium">Текущий статус</Label>
            <div className="mt-1">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${currentStatus?.color}`}>
                <CurrentIcon className="h-3 w-3" />
                {order.status}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Новый статус</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => {
                  const Icon = status.icon;
                  return (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {status.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="comment">Комментарий (опционально)</Label>
            <Textarea
              id="comment"
              placeholder="Добавьте комментарий к изменению статуса..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedStatus}
          >
            Изменить статус
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}