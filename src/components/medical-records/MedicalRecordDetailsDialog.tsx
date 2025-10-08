import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
} from 'lucide-react';
import type { MedicalRecord } from '@/types/medicalRecord';

interface MedicalRecordDetailsDialogProps {
  record: MedicalRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MedicalRecordDetailsDialog({
  record,
  open,
  onOpenChange,
}: MedicalRecordDetailsDialogProps) {
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
              <p className="text-sm text-muted-foreground">{record.veterinarianName}</p>
            </div>
            <Badge variant="secondary">
              {new Date(record.date).toLocaleDateString('es-CO')}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Activity className="h-5 w-5 text-success" />
              <div>
                <p className="text-xs text-muted-foreground">Peso</p>
                <p className="text-sm font-semibold">{record.weight || 'N/A'} kg</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Thermometer className="h-5 w-5 text-warning" />
              <div>
                <p className="text-xs text-muted-foreground">Temperatura</p>
                <p className="text-sm font-semibold">{record.temperature || 'N/A'}°C</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Heart className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-xs text-muted-foreground">Frecuencia</p>
                <p className="text-sm font-semibold">{record.heartRate || 'N/A'} bpm</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-info" />
              <div>
                <p className="text-xs text-muted-foreground">Próxima Visita</p>
                <p className="text-sm font-semibold">
                  {record.nextVisit ? new Date(record.nextVisit).toLocaleDateString('es-CO') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Motivo de Consulta</p>
                <p className="text-sm">{record.reason}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Síntomas</p>
                <p className="text-sm">{record.symptoms}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ClipboardList className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Diagnóstico</p>
                <p className="text-sm">{record.diagnosis}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Tratamiento</p>
                <p className="text-sm">{record.treatment}</p>
              </div>
            </div>

            {record.prescriptions && (
              <div className="flex items-start gap-3">
                <Pill className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Prescripciones</p>
                  <p className="text-sm">{record.prescriptions}</p>
                </div>
              </div>
            )}

            {record.observations && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Observaciones</p>
                    <p className="text-sm text-muted-foreground">{record.observations}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            <p>Creado: {new Date(record.createdAt).toLocaleString('es-CO')}</p>
            <p>Actualizado: {new Date(record.updatedAt).toLocaleString('es-CO')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
