
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Shield,
  User,
  Settings
} from 'lucide-react';
import { AddUserModal } from './modals/AddUserModal';
import { EditUserModal } from './modals/EditUserModal';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'assembler';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Иван Петров',
    email: 'admin@techpower.ru',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 10:30',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    name: 'Анна Сидорова',
    email: 'manager@techpower.ru',
    role: 'manager',
    status: 'active',
    lastLogin: '2024-01-15 09:15',
    createdAt: '2024-01-05'
  },
  {
    id: 3,
    name: 'Сергей Козлов',
    email: 'assembler@techpower.ru',
    role: 'assembler',
    status: 'active',
    lastLogin: '2024-01-14 16:45',
    createdAt: '2024-01-10'
  }
];

const roleLabels = {
  admin: 'Администратор',
  manager: 'Менеджер',
  assembler: 'Сборщик'
};

const roleColors = {
  admin: 'bg-red-100 text-red-800',
  manager: 'bg-blue-100 text-blue-800',
  assembler: 'bg-green-100 text-green-800'
};

export function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (userData: Omit<User, 'id' | 'lastLogin' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Math.max(...users.map(u => u.id)) + 1,
      lastLogin: 'Никогда',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
  };

  const handleEditUser = (userData: User) => {
    setUsers(users.map(user => user.id === userData.id ? userData : user));
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Пользователи</h1>
          <p className="text-gray-600 mt-1">Управление аккаунтами и ролями</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить пользователя
        </Button>
      </div>

      {/* Фильтры */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Поиск по имени или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Все роли</option>
              <option value="admin">Администратор</option>
              <option value="manager">Менеджер</option>
              <option value="assembler">Сборщик</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Статистика ролей */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего пользователей</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Администраторы</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Менеджеры</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'manager').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Settings className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Сборщики</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'assembler').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Таблица пользователей */}
      <Card>
        <CardHeader>
          <CardTitle>Список пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Пользователь</th>
                  <th className="text-left py-3 px-4">Роль</th>
                  <th className="text-left py-3 px-4">Статус</th>
                  <th className="text-left py-3 px-4">Последний вход</th>
                  <th className="text-left py-3 px-4">Дата создания</th>
                  <th className="text-left py-3 px-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={roleColors[user.role]}>
                        {roleLabels[user.role]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status === 'active' ? 'Активен' : 'Неактивен'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.lastLogin}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.createdAt}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(user)}
                          className="gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Изменить
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
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

      {/* Модальные окна */}
      <AddUserModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddUser}
      />
      
      {selectedUser && (
        <EditUserModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          user={selectedUser}
          onSubmit={handleEditUser}
        />
      )}
    </div>
  );
}
