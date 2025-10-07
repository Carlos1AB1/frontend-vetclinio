import { Home, Users, Calendar, FileText, Package, BarChart3, Settings, LogOut, PawPrint, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'veterinarian', 'receptionist'] },
  { name: 'Pacientes', href: '/patients', icon: PawPrint, roles: ['admin', 'veterinarian', 'receptionist'] },
  { name: 'Propietarios', href: '/owners', icon: Users, roles: ['admin', 'veterinarian', 'receptionist'] },
  { name: 'Citas', href: '/appointments', icon: Calendar, roles: ['admin', 'veterinarian', 'receptionist'] },
  { name: 'Historias Clínicas', href: '/medical-records', icon: FileText, roles: ['admin', 'veterinarian'] },
  { name: 'Inventario', href: '/inventory', icon: Package, roles: ['admin', 'veterinarian'] },
  { name: 'Reportes', href: '/reports', icon: BarChart3, roles: ['admin'] },
  { name: 'Usuarios', href: '/users', icon: UserCircle, roles: ['admin'] },
  { name: 'Configuración', href: '/settings', icon: Settings, roles: ['admin'] },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <PawPrint className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">VetClinic</h1>
          <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 rounded-lg bg-sidebar-accent p-3">
          <p className="text-sm font-medium text-sidebar-foreground">{user?.fullName}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <p className="mt-1 text-xs font-medium text-primary capitalize">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
