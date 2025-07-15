import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  const testAccounts = [
    { email: 'admin@techpower.ru', password: 'admin123', role: 'Администратор' },
    { email: 'manager@techpower.ru', password: 'manager123', role: 'Менеджер' },
    { email: 'builder@techpower.ru', password: 'builder123', role: 'Сборщик' }
  ];

  const fillTestAccount = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-primary rounded-lg p-2">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">TechPower</h1>
          </div>
          <p className="text-muted-foreground">Войдите в панель управления</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Авторизация</CardTitle>
            <CardDescription>
              Введите свои данные для входа в систему
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@techpower.ru"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Тестовые аккаунты</CardTitle>
            <CardDescription className="text-xs">
              Нажмите на аккаунт для быстрого входа
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {testAccounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fillTestAccount(account.email, account.password)}
              >
                <div>
                  <p className="text-sm font-medium">{account.email}</p>
                  <p className="text-xs text-muted-foreground">{account.password}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {account.role}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}