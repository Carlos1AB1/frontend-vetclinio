import { Calendar, Dog, Briefcase, LogOut, PawPrint } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Mis Citas', href: '/owner/appointments', icon: Calendar },
    { name: 'Reservar Cita', href: '/owner/book-appointment', icon: Calendar },
    { name: 'Mis Mascotas', href: '/owner/pets', icon: Dog },
    { name: 'Servicios Disponibles', href: '/owner/services', icon: Briefcase },
];

export function OwnerLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen">
            <div className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
                <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                        <PawPrint className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-sidebar-foreground">Portal Cliente</h1>
                        <p className="text-xs text-muted-foreground">VetClinic</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {navigation.map((item) => {
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
                        <p className="mt-1 text-xs font-medium text-primary capitalize">Cliente</p>
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

            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}