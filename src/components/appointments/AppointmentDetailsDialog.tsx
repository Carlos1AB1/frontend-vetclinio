import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, FileText, AlertCircle, PawPrint } from 'lucide-react';
import type { Appointment } from '@/types/appointment';

interface AppointmentDetailsDialogProps {
  appointment: Appointment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailsDialog({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailsDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalles de la Cita</DialogTitle>
          <DialogDescription>
            Información completa de la cita médica
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
              <p className="text-sm text-muted-foreground">{appointment.ownerName}</p>
            </div>
            {getStatusBadge(appointment.status)}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Fecha</p>
                  <p className="text-sm">
                    {new Date(appointment.date).toLocaleDateString('es-CO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Hora y Duración</p>
                  <p className="text-sm">{appointment.time} ({appointment.duration} minutos)</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Veterinario</p>
                  <p className="text-sm">{appointment.veterinarianName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PawPrint className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Paciente</p>
                  <p className="text-sm">{appointment.patientName}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Motivo de Consulta</p>
                <p className="text-sm">{appointment.reason}</p>
              </div>
            </div>

            {appointment.notes && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Notas</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {appointment.notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            <p>Creada: {new Date(appointment.createdAt).toLocaleString('es-CO')}</p>
            <p>Actualizada: {new Date(appointment.updatedAt).toLocaleString('es-CO')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
