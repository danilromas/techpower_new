
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
import { Textarea } from "@/components/ui/textarea";

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (productData: {
    name: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    specifications: string;
  }) => void;
}

export function AddProductModal({ open, onOpenChange, onSubmit }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'cpu',
    price: '',
    stock: '',
    description: '',
    specifications: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'cpu', label: 'Процессоры' },
    { value: 'gpu', label: 'Видеокарты' },
    { value: 'ram', label: 'Оперативная память' },
    { value: 'storage', label: 'Накопители' },
    { value: 'motherboard', label: 'Материнские платы' },
    { value: 'psu', label: 'Блоки питания' },
    { value: 'case', label: 'Корпуса' },
    { value: 'cooling', label: 'Охлаждение' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
      newErrors.name = 'Название товара обязательно';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Бренд обязателен';
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Введите корректную цену';
    }

    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Введите корректное количество';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description,
      specifications: formData.specifications
    });

    // Сброс формы
    setFormData({
      name: '',
      brand: '',
      category: 'cpu',
      price: '',
      stock: '',
      description: '',
      specifications: ''
    });
    setErrors({});
    onOpenChange(false);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      brand: '',
      category: 'cpu',
      price: '',
      stock: '',
      description: '',
      specifications: ''
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить товар</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название товара</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Введите название товара"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Бренд</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Введите бренд"
              />
              {errors.brand && <p className="text-sm text-red-600">{errors.brand}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена (₽)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Количество на складе</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
              {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Введите описание товара"
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specifications">Технические характеристики</Label>
            <Textarea
              id="specifications"
              name="specifications"
              value={formData.specifications}
              onChange={handleInputChange}
              placeholder="Введите технические характеристики (необязательно)"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              Добавить товар
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
