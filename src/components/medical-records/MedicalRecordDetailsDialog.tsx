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
import {
  Calendar,
  User,
  FileText,
  Activity,
  Thermometer,
  Heart,
  Pill,
  ClipboardList,
  AlertCircle,
  Edit,
  Trash2,
} from 'lucide-react';
import type { MedicalRecord } from '@/types/medicalRecord';

interface MedicalRecordDetailsDialogProps {
  record: MedicalRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MedicalRecordDetailsDialog({
  record,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: MedicalRecordDetailsDialogProps) {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Historia Clínica</DialogTitle>
          <DialogDescription>
            Registro médico de {record.patientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{record.patientName}</h3>
              <p className="text-sm text-muted-foreground">
                Dr. {record.veterinarianName}
              </p>
            </div>
            <div className="text-right">
              <Badge variant={record.followUpRequired ? "default" : "secondary"}>
                {formatDateTime(record.recordDate)}
              </Badge>
              {record.followUpRequired && (
                <Badge variant="outline" className="ml-2">
                  Seguimiento requerido
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {record.weight && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Activity className="h-5 w-5 text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Peso</p>
                  <p className="text-sm font-semibold">{record.weight} kg</p>
                </div>
              </div>
            )}

            {record.temperature && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Thermometer className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-xs text-muted-foreground">Temperatura</p>
                  <p className="text-sm font-semibold">{record.temperature}°C</p>
                </div>
              </div>
            )}

            {record.followUpDate && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-info" />
                <div>
                  <p className="text-xs text-muted-foreground">Seguimiento</p>
                  <p className="text-sm font-semibold">
                    {new Date(record.followUpDate).toLocaleDateString('es-CO')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            {record.symptoms && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Síntomas</p>
                  <p className="text-sm whitespace-pre-wrap">{record.symptoms}</p>
                </div>
              </div>
            )}

            {record.vitalSigns && (
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Signos Vitales</p>
                  <p className="text-sm whitespace-pre-wrap">{record.vitalSigns}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <ClipboardList className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Diagnóstico</p>
                <p className="text-sm whitespace-pre-wrap">{record.diagnosis}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Pill className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Tratamiento</p>
                <p className="text-sm whitespace-pre-wrap">{record.treatment}</p>
              </div>
            </div>

            {record.notes && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Notas Adicionales</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{record.notes}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            <p>Creado: {formatDateTime(record.createdAt)}</p>
            <p>Actualizado: {formatDateTime(record.updatedAt)}</p>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <DialogFooter className="mt-6">
            {onEdit && (
              <Button onClick={onEdit} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
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
