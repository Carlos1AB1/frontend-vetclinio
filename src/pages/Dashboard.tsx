import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, PawPrint, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardService, appointmentService } from '@/services';
import { useToast } from '@/hooks/use-toast';

const statusStyles = {
  completed: { bg: 'bg-success/10', text: 'text-success', label: 'Completada' },
  'in-progress': { bg: 'bg-warning/10', text: 'text-warning', label: 'En Progreso' },
  pending: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Pendiente' },
  COMPLETED: { bg: 'bg-success/10', text: 'text-success', label: 'Completada' },
  IN_PROGRESS: { bg: 'bg-warning/10', text: 'text-warning', label: 'En Progreso' },
  SCHEDULED: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Programada' },
  CONFIRMED: { bg: 'bg-info/10', text: 'text-info', label: 'Confirmada' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalOwners: 0,
    todayAppointments: 0,
    lowStockItems: 0,
    monthlyRevenue: 0,
    activeUsers: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    
    // Refrescar el dashboard cada 30 segundos
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);
    
    // Refrescar cuando la ventana recupera el foco
    const handleFocus = () => {
      loadDashboardData();
    };
    window.addEventListener('focus', handleFocus);
    
    // Escuchar eventos personalizados para refrescar cuando se crea una cita
    const handleAppointmentCreated = () => {
      console.log('🔄 Evento de cita creada recibido, refrescando dashboard...');
      loadDashboardData();
    };
    const handleAppointmentUpdated = () => {
      console.log('🔄 Evento de cita actualizada recibido, refrescando dashboard...');
      loadDashboardData();
    };
    
    window.addEventListener('appointment_created', handleAppointmentCreated);
    window.addEventListener('appointment_updated', handleAppointmentUpdated);
    
    // Escuchar eventos de storage para refrescar cuando se crea una cita desde otra pestaña
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appointment_created' || e.key === 'appointment_updated') {
        loadDashboardData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('appointment_created', handleAppointmentCreated);
      window.removeEventListener('appointment_updated', handleAppointmentUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard stats
      try {
        const dashboardStats = await dashboardService.getStats();
        
        // Update state with all stats
        const newStats = {
          totalPatients: dashboardStats.totalPatients != null ? Number(dashboardStats.totalPatients) : 0,
          totalOwners: dashboardStats.totalOwners != null ? Number(dashboardStats.totalOwners) : 0,
          todayAppointments: dashboardStats.todayAppointments != null ? Number(dashboardStats.todayAppointments) : 0,
          lowStockItems: dashboardStats.lowStockItems != null ? Number(dashboardStats.lowStockItems) : 0,
          monthlyRevenue: dashboardStats.monthlyRevenue != null ? Number(dashboardStats.monthlyRevenue) : 0,
          activeUsers: dashboardStats.activeUsers != null ? Number(dashboardStats.activeUsers) : 0,
        };
        
        setStats(newStats);
      } catch (statsError: any) {
        console.error('Error loading dashboard stats:', statsError);
        console.error('Error response:', statsError.response);
        console.error('Error details:', statsError.response?.data || statsError.message);
        toast({
          title: 'Error al cargar estadísticas',
          description: statsError.response?.data?.message || 'No se pudieron cargar las estadísticas del dashboard',
          variant: 'destructive',
        });
      }

      // Load today's appointments
      try {
        const today = new Date().toISOString().split('T')[0];
        const appointments = await appointmentService.getByDate(today);
        setRecentAppointments(appointments.slice(0, 5));
      } catch (appointmentError: any) {
        console.warn('Appointments endpoint not available:', appointmentError);
        // Keep empty array
      }
    } catch (error: any) {
      console.error('Dashboard error:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al cargar los datos del dashboard',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Usar useMemo para recalcular cuando stats o recentAppointments cambien
  const statsCards = useMemo(() => [
      {
        name: 'Citas Hoy',
        value: stats.todayAppointments ?? 0,
        icon: Calendar,
        description: `${recentAppointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length} pendientes`,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
      },
      {
        name: 'Pacientes Activos',
        value: stats.totalPatients ?? 0,
        icon: PawPrint,
        description: 'Total registrados',
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
      },
      {
        name: 'Propietarios',
        value: stats.totalOwners ?? 0,
        icon: Users,
        description: 'Total registrados',
        color: 'text-info',
        bgColor: 'bg-info/10',
      },
      {
        name: 'Alertas',
        value: stats.lowStockItems ?? 0,
        icon: AlertCircle,
        description: 'Stock bajo',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
      },
  ], [stats, recentAppointments]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido de nuevo, {user?.fullName}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      ) : (
        <>
          {/* Mensaje informativo si no hay datos */}
          {stats.totalPatients === 0 && stats.totalOwners === 0 && stats.todayAppointments === 0 && (
            <Card className="border-info/20 bg-info/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-info" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      No hay datos registrados aún
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Comienza creando propietarios, pacientes y citas para ver estadísticas aquí
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat) => (
              <Card key={stat.name}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.name}
                    </CardTitle>
                    <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{String(stat.value)}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Citas de Hoy
            </CardTitle>
            <CardDescription>Agenda del día actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground">{appointment.owner}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{appointment.time}</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        statusStyles[appointment.status].bg
                      } ${statusStyles[appointment.status].text}`}
                    >
                      {statusStyles[appointment.status].label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Estadísticas del Mes
            </CardTitle>
            <CardDescription>Resumen de actividades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Consultas</span>
                  <span className="font-medium text-foreground">124</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vacunaciones</span>
                  <span className="font-medium text-foreground">89</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-secondary" style={{ width: '68%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cirugías</span>
                  <span className="font-medium text-foreground">32</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-accent" style={{ width: '45%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Emergencias</span>
                  <span className="font-medium text-foreground">18</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-warning" style={{ width: '28%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        </>
      )}
    </div>
  );
}
