import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InformedConsent } from '@/services/informedConsentService';
import { CheckCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface InformedConsentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  consent?: InformedConsent;
  onSign?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function InformedConsentDetailsDialog({
  open,
  onClose,
  consent,
  onSign,
  onDelete,
}: InformedConsentDetailsDialogProps) {
  if (!consent) return null;

  const getStatusBadge = (consent: InformedConsent) => {
    if (consent.isSigned) {
      return <Badge variant="default">Firmado</Badge>;
    }
    return <Badge variant="secondary">Pendiente</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Consentimiento Informado</DialogTitle>
              <DialogDescription>Detalles del documento de consentimiento</DialogDescription>
            </div>
            {getStatusBadge(consent)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Paciente</h3>
              <p className="text-lg font-semibold">{consent.patientName || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Tipo de Procedimiento</h3>
              <p className="text-lg">{consent.procedureType}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Descripción del Procedimiento</h3>
            <p className="text-base whitespace-pre-wrap">{consent.procedureDescription || consent.description}</p>
          </div>

          {consent.risks && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Riesgos</h3>
              <p className="text-base whitespace-pre-wrap">{consent.risks}</p>
            </div>
          )}

          {consent.benefits && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Beneficios</h3>
              <p className="text-base whitespace-pre-wrap">{consent.benefits}</p>
            </div>
          )}

          {consent.alternatives && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Alternativas</h3>
              <p className="text-base whitespace-pre-wrap">{consent.alternatives}</p>
            </div>
          )}

          {consent.isSigned && (
            <div className="grid grid-cols-2 gap-4">
              {consent.ownerSignature && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Firma</h3>
                  <p className="text-base">{consent.ownerSignature}</p>
                </div>
              )}
              {consent.signedDate && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Fecha de Firma</h3>
                  <p className="text-base">
                    {format(new Date(consent.signedDate), "dd 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
                  </p>
                </div>
              )}
            </div>
          )}

          {consent.createdAt && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Fecha de Creación</h3>
              <p className="text-base">
                {format(new Date(consent.createdAt), "dd 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <div>
            {!consent.isSigned && onSign && (
              <Button onClick={() => onSign(consent.id)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Firmar Consentimiento
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {onDelete && (
              <Button variant="destructive" onClick={() => onDelete(consent.id)}>
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

