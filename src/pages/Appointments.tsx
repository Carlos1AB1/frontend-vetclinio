import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Clock, User, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentFormDialog } from '@/components/appointments/AppointmentFormDialog';
import { AppointmentDetailsDialog } from '@/components/appointments/AppointmentDetailsDialog';
import { appointmentService } from '@/services/appointmentService';
import type { Appointment } from '@/types/appointment';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadAppointments = async () => {
    try {
      setLoading(true);
      console.log('🔄 [loadAppointments] Cargando CITAS REALES desde backend...');
      const response = await appointmentService.getAll(0, 100, searchTerm);
      console.log('✅ [loadAppointments] Citas recibidas:', response.content?.length || 0, 'citas');
      console.log('✅ [loadAppointments] Datos:', response.content);
      setAppointments(response.content || []);
    } catch (error: any) {
      console.error('❌ Error al cargar citas:', error);
      toast.error('Error al cargar las citas');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadAppointments();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (id: number) => {
    try {
      await appointmentService.delete(id);
      toast.success('Cita eliminada exitosamente');
      loadAppointments();
      setIsDetailsOpen(false);
    } catch (error: any) {
      console.error('❌ Error al eliminar:', error);
      toast.error('Error al eliminar la cita');
    }
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM yyyy 'a las' HH:mm", { locale: es });
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      SCHEDULED: { label: 'Programada', variant: 'secondary' as const },
      CONFIRMED: { label: 'Confirmada', variant: 'default' as const },
      IN_PROGRESS: { label: 'En Curso', variant: 'default' as const },
      COMPLETED: { label: 'Completada', variant: 'outline' as const },
      CANCELLED: { label: 'Cancelada', variant: 'destructive' as const },
    };
    const config = variants[status as keyof typeof variants] || variants.SCHEDULED;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getAppointmentTypeBadge = (type: string) => {
    const types = {
      CONSULTATION: { label: 'Consulta', icon: '🩺' },
      VACCINATION: { label: 'Vacunación', icon: '💉' },
      SURGERY: { label: 'Cirugía', icon: '🏥' },
      CHECKUP: { label: 'Chequeo', icon: '📋' },
      EMERGENCY: { label: 'Emergencia', icon: '🚨' },
    };
    const config = types[type as keyof typeof types] || types.CONSULTATION;
    return (
      <Badge variant="outline">
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </Badge>
    );
  };

  const statusCounts = {
    all: appointments.length,
    SCHEDULED: appointments.filter(a => a.status === 'SCHEDULED').length,
    CONFIRMED: appointments.filter(a => a.status === 'CONFIRMED').length,
    COMPLETED: appointments.filter(a => a.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Citas Médicas</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de agenda y citas veterinarias
          </p>
        </div>
        <AppointmentFormDialog onSuccess={loadAppointments}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cita
          </Button>
        </AppointmentFormDialog>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="SCHEDULED">Programadas ({statusCounts.SCHEDULED})</TabsTrigger>
          <TabsTrigger value="CONFIRMED">Confirmadas ({statusCounts.CONFIRMED})</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completadas ({statusCounts.COMPLETED})</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por paciente, propietario o motivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {loading ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            Cargando citas desde el backend...
          </div>
        </Card>
      ) : filteredAppointments.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">No hay citas registradas</p>
            <p className="text-sm">
              {searchTerm 
                ? 'No se encontraron resultados para tu búsqueda'
                : 'Comienza creando una nueva cita médica'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedAppointment(appointment);
                setIsDetailsOpen(true);
              }}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Propietario: {appointment.ownerName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(appointment.status)}
                      {getAppointmentTypeBadge(appointment.appointmentType)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateTime(appointment.scheduledDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.durationMinutes} minutos</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{appointment.veterinarianName}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm">
                      <span className="font-medium text-muted-foreground">Motivo:</span>{' '}
                      {appointment.reason}
                    </p>
                  </div>

                  {appointment.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Notas:</span> {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedAppointment && (
        <AppointmentDetailsDialog
          appointment={selectedAppointment}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onEdit={() => {
            setIsDetailsOpen(false);
            // Aquí se podría abrir el formulario de edición
          }}
          onDelete={() => handleDelete(selectedAppointment.id)}
        />
      )}
    </div>
  );
}
