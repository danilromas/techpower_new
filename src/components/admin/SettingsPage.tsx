
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database,
  Mail,
  Globe,
  Palette
} from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
          <p className="text-gray-600 mt-1">Конфигурация системы и пользователей</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Профиль
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Имя</label>
                <Input defaultValue="Администратор" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue="admin@techpower.ru" />
              </div>
              <div>
                <label className="text-sm font-medium">Телефон</label>
                <Input defaultValue="+7 (999) 000-00-00" />
              </div>
              <Button className="w-full">Сохранить</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Уведомления
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Новые заказы</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Низкие остатки</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email уведомления</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SMS уведомления</span>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Безопасность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Текущий пароль</label>
                <Input type="password" />
              </div>
              <div>
                <label className="text-sm font-medium">Новый пароль</label>
                <Input type="password" />
              </div>
              <div>
                <label className="text-sm font-medium">Подтвердите пароль</label>
                <Input type="password" />
              </div>
              <Button variant="outline" className="w-full">Изменить пароль</Button>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Двухфакторная аутентификация</span>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Система
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Автобэкап</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Логирование</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Режим разработки</span>
                <Switch />
              </div>
              <Button variant="outline" className="w-full">Экспорт данных</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email настройки
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">SMTP сервер</label>
                <Input defaultValue="smtp.yandex.ru" />
              </div>
              <div>
                <label className="text-sm font-medium">Порт</label>
                <Input defaultValue="587" />
              </div>
              <div>
                <label className="text-sm font-medium">Логин</label>
                <Input defaultValue="noreply@techpower.ru" />
              </div>
              <div>
                <label className="text-sm font-medium">Пароль</label>
                <Input type="password" />
              </div>
              <Button variant="outline" className="w-full">Тест подключения</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Общие настройки
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Название компании</label>
                <Input defaultValue="TechPower" />
              </div>
              <div>
                <label className="text-sm font-medium">Валюта</label>
                <Input defaultValue="RUB" />
              </div>
              <div>
                <label className="text-sm font-medium">Часовой пояс</label>
                <Input defaultValue="Europe/Moscow" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Темная тема</span>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
