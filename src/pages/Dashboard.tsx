import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, PawPrint, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const stats = [
  {
    name: 'Citas Hoy',
    value: '12',
    icon: Calendar,
    description: '3 pendientes',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    name: 'Pacientes Activos',
    value: '248',
    icon: PawPrint,
    description: '+12 este mes',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    name: 'Propietarios',
    value: '186',
    icon: Users,
    description: '+8 este mes',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    name: 'Alertas',
    value: '5',
    icon: AlertCircle,
    description: 'Stock bajo',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
];

const recentAppointments = [
  { id: 1, patient: 'Max', owner: 'Juan Pérez', time: '09:00', type: 'Consulta', status: 'completed' },
  { id: 2, patient: 'Luna', owner: 'María García', time: '10:30', type: 'Vacunación', status: 'completed' },
  { id: 3, patient: 'Rocky', owner: 'Carlos López', time: '11:00', type: 'Cirugía', status: 'in-progress' },
  { id: 4, patient: 'Bella', owner: 'Ana Martínez', time: '14:00', type: 'Control', status: 'pending' },
  { id: 5, patient: 'Toby', owner: 'Luis Rodríguez', time: '15:30', type: 'Consulta', status: 'pending' },
];

const statusStyles = {
  completed: { bg: 'bg-success/10', text: 'text-success', label: 'Completada' },
  'in-progress': { bg: 'bg-warning/10', text: 'text-warning', label: 'En Progreso' },
  pending: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Pendiente' },
};

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido de nuevo, {user?.fullName}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
    </div>
  );
}
