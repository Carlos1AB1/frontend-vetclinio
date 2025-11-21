import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Prescription } from '@/services/prescriptionService';
import { Download, FileText, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PrescriptionDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  prescription?: Prescription;
  onEdit?: (prescription: Prescription) => void;
  onDelete?: (id: number) => void;
  onExport?: (id: number, format: 'PDF' | 'EXCEL') => void;
}

export function PrescriptionDetailsDialog({
  open,
  onClose,
  prescription,
  onEdit,
  onDelete,
  onExport,
}: PrescriptionDetailsDialogProps) {
  if (!prescription) return null;

  const getStatusBadge = (prescription: Prescription) => {
    if (prescription.isExpired) {
      return <Badge variant="destructive">Vencida</Badge>;
    }
    if (prescription.isCurrentlyActive) {
      return <Badge variant="default">Activa</Badge>;
    }
    if (prescription.status) {
      const variants = {
        ACTIVE: { label: 'Activa', variant: 'default' as const },
        COMPLETED: { label: 'Completada', variant: 'outline' as const },
        CANCELLED: { label: 'Cancelada', variant: 'destructive' as const },
      };
      const config = variants[prescription.status] || variants.ACTIVE;
      return <Badge variant={config.variant}>{config.label}</Badge>;
    }
    return <Badge variant="secondary">Sin estado</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Detalles de la Prescripción</DialogTitle>
              <DialogDescription>Información completa de la prescripción médica</DialogDescription>
            </div>
            {getStatusBadge(prescription)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Medicamento</h3>
              <p className="text-lg font-semibold">{prescription.medicationName || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Paciente</h3>
              <p className="text-lg">{prescription.patientName || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Dosis</h3>
              <p className="text-base">{prescription.dosage}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Frecuencia</h3>
              <p className="text-base">{prescription.frequency}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Duración</h3>
              <p className="text-base">{prescription.duration}</p>
            </div>
          </div>

          {prescription.startDate && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Fecha de Inicio</h3>
                <p className="text-base">
                  {format(new Date(prescription.startDate), "dd 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
                </p>
              </div>
              {prescription.endDate && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Fecha de Fin</h3>
                  <p className="text-base">
                    {format(new Date(prescription.endDate), "dd 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
                  </p>
                </div>
              )}
            </div>
          )}

          {prescription.instructions && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Instrucciones</h3>
              <p className="text-base whitespace-pre-wrap">{prescription.instructions}</p>
            </div>
          )}

          {prescription.prescribedBy && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Prescrito por</h3>
              <p className="text-base">{prescription.prescribedBy}</p>
            </div>
          )}

          {prescription.createdAt && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Fecha de Creación</h3>
              <p className="text-base">
                {format(new Date(prescription.createdAt), "dd 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            {onExport && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onExport(prescription.id, 'PDF')}
                  title="Exportar PDF"
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onExport(prescription.id, 'EXCEL')}
                  title="Exportar Excel"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(prescription)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" onClick={() => onDelete(prescription.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            )}
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

