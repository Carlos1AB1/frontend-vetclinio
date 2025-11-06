import { useState } from 'react';
import { Search, Plus, Calendar, Clock, User, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentFormDialog } from '@/components/appointments/AppointmentFormDialog';
import { AppointmentDetailsDialog } from '@/components/appointments/AppointmentDetailsDialog';
import type { Appointment } from '@/types/appointment';

export default function Appointments() {
  const [appointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = `${apt.patientName} ${apt.ownerName} ${apt.reason}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: { label: 'Programada', variant: 'secondary' as const },
      confirmed: { label: 'Confirmada', variant: 'default' as const },
      'in-progress': { label: 'En Curso', variant: 'default' as const },
      completed: { label: 'Completada', variant: 'outline' as const },
      cancelled: { label: 'Cancelada', variant: 'destructive' as const },
    };
    const config = variants[status as keyof typeof variants] || variants.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const statusCounts = {
    all: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
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
        <AppointmentFormDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cita
          </Button>
        </AppointmentFormDialog>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="scheduled">Programadas ({statusCounts.scheduled})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmadas ({statusCounts.confirmed})</TabsTrigger>
          <TabsTrigger value="completed">Completadas ({statusCounts.completed})</TabsTrigger>
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
                  {getStatusBadge(appointment.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(appointment.date).toLocaleDateString('es-CO')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time} ({appointment.duration} min)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{appointment.veterinarianName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span className="truncate">{appointment.reason}</span>
                  </div>
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

      {filteredAppointments.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No se encontraron citas con esos criterios de búsqueda
          </p>
        </Card>
      )}

      {selectedAppointment && (
        <AppointmentDetailsDialog
          appointment={selectedAppointment}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  );
}
