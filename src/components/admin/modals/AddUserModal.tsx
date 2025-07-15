
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

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userData: {
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'assembler';
    status: 'active' | 'inactive';
  }) => void;
}

export function AddUserModal({ open, onOpenChange, onSubmit }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'manager' as 'admin' | 'manager' | 'assembler',
    status: 'active' as 'active' | 'inactive',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status
    });

    // Сброс формы
    setFormData({
      name: '',
      email: '',
      role: 'manager',
      status: 'active',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    onOpenChange(false);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      role: 'manager',
      status: 'active',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить пользователя</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Полное имя</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Введите полное имя"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Роль</Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="manager">Менеджер</option>
              <option value="assembler">Сборщик</option>
              <option value="admin">Администратор</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Статус</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Активен</option>
              <option value="inactive">Неактивен</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Минимум 6 символов"
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Повторите пароль"
            />
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              Добавить пользователя
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
