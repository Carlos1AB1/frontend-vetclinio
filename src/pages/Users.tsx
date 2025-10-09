import { useState } from 'react';
import { Plus, Search, UserCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserFormDialog } from '@/components/users/UserFormDialog';
import { UserDetailsDialog } from '@/components/users/UserDetailsDialog';
import { User, UserRole } from '@/contexts/AuthContext';

const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@vetclinic.com',
    fullName: 'Dr. María García',
    role: 'admin',
  },
  {
    id: '2',
    username: 'vet1',
    email: 'vet@vetclinic.com',
    fullName: 'Dr. Carlos López',
    role: 'veterinarian',
  },
  {
    id: '3',
    username: 'recep1',
    email: 'recep@vetclinic.com',
    fullName: 'Ana Martínez',
    role: 'receptionist',
  },
];

export default function Users() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (data: Omit<User, 'id'>) => {
    const newUser: User = {
      ...data,
      id: String(users.length + 1),
    };
    setUsers([...users, newUser]);
    setIsFormOpen(false);
  };

  const handleEditUser = (data: Omit<User, 'id'>) => {
    if (!selectedUser) return;
    const updatedUser: User = {
      ...data,
      id: selectedUser.id,
    };
    setUsers(users.map(user => user.id === selectedUser.id ? updatedUser : user));
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    setIsDetailsOpen(false);
    setSelectedUser(null);
  };

  const getRoleBadge = (role: UserRole) => {
    const config = {
      admin: { label: 'Administrador', variant: 'default' as const },
      veterinarian: { label: 'Veterinario', variant: 'secondary' as const },
      receptionist: { label: 'Recepcionista', variant: 'outline' as const },
    };
    const { label, variant } = config[role];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuarios del Sistema</h1>
          <p className="text-muted-foreground">Gestiona los usuarios y sus permisos</p>
        </div>
        <Button onClick={() => { setSelectedUser(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Usuario
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="veterinarian">Veterinario</SelectItem>
              <SelectItem value="receptionist">Recepcionista</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="py-12 text-center">
            <UserCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No hay usuarios</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm || roleFilter !== 'all'
                ? 'No se encontraron usuarios con los filtros aplicados'
                : 'Comienza agregando el primer usuario al sistema'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <UserCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelectedUser(user); setIsDetailsOpen(true); }}
                      >
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <UserFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={selectedUser ? handleEditUser : handleAddUser}
        initialData={selectedUser || undefined}
      />

      <UserDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        user={selectedUser}
        onEdit={(user) => { setSelectedUser(user); setIsFormOpen(true); setIsDetailsOpen(false); }}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}
