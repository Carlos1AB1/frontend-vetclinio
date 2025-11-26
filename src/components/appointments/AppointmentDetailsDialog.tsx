import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, FileText, AlertCircle, PawPrint, Edit, Trash2, XCircle } from 'lucide-react';
import type { Appointment } from '@/types/appointment';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentDetailsDialogProps {
  appointment: Appointment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
}

export function AppointmentDetailsDialog({
  appointment,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onCancel,
}: AppointmentDetailsDialogProps) {
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM yyyy 'a las' HH:mm", { locale: es });
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
              <p className="text-sm text-muted-foreground">
                Propietario: {appointment.ownerName}
                {appointment.ownerPhone && ` • ${appointment.ownerPhone}`}
              </p>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(appointment.status)}
              {getAppointmentTypeBadge(appointment.appointmentType)}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Fecha y Hora</p>
                  <p className="text-sm">{formatDateTime(appointment.scheduledDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Duración</p>
                  <p className="text-sm">{appointment.durationMinutes} minutos</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Veterinario</p>
                  <p className="text-sm">{appointment.veterinarianName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PawPrint className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Paciente</p>
                  <p className="text-sm">
                    {appointment.patientName}
                    {appointment.patientSpecies && ` (${appointment.patientSpecies})`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Motivo de Consulta</p>
                <p className="text-sm whitespace-pre-wrap">{appointment.reason}</p>
              </div>
            </div>

            {appointment.notes && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Notas Adicionales</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{appointment.notes}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            <p>Creado: {formatDateTime(appointment.createdAt)}</p>
            <p>Actualizado: {formatDateTime(appointment.updatedAt)}</p>
          </div>
        </div>

        {(onEdit || onDelete || onCancel) && (
          <DialogFooter className="mt-6">
            {onEdit && (
              <Button onClick={onEdit} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
            {onCancel && appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
              <Button onClick={onCancel} variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar Cita
              </Button>
            )}
            {onDelete && (
              <Button onClick={onDelete} variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
