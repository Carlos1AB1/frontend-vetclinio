import { useState, useEffect } from 'react';
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
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to load stats, if fails use default values
      try {
        const dashboardStats = await dashboardService.getStats();
        setStats(dashboardStats);
      } catch (statsError) {
        console.warn('Dashboard stats endpoint not available, using defaults');
        // Keep default values
      }

      // Try to load today's appointments
      try {
        const today = new Date().toISOString().split('T')[0];
        const appointments = await appointmentService.getByDate(today);
        setRecentAppointments(appointments.slice(0, 5));
      } catch (appointmentError) {
        console.warn('Appointments endpoint not available');
        // Keep empty array
      }
    } catch (error: any) {
      console.error('Dashboard error:', error);
      // Don't show error toast, just log it
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      name: 'Citas Hoy',
      value: String(stats.todayAppointments),
      icon: Calendar,
      description: `${recentAppointments.filter(a => a.status === 'SCHEDULED').length} pendientes`,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      name: 'Pacientes Activos',
      value: String(stats.totalPatients),
      icon: PawPrint,
      description: 'Total registrados',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      name: 'Propietarios',
      value: String(stats.totalOwners),
      icon: Users,
      description: 'Total registrados',
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      name: 'Alertas',
      value: String(stats.lowStockItems),
      icon: AlertCircle,
      description: 'Stock bajo',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

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
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
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
