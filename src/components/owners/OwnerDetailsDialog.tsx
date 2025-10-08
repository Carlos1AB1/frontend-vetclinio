import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, FileText, Calendar, Hash } from 'lucide-react';
import type { Owner } from '@/types/owner';

interface OwnerDetailsDialogProps {
  owner: Owner;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OwnerDetailsDialog({
  owner,
  open,
  onOpenChange,
}: OwnerDetailsDialogProps) {
  const getDocumentTypeLabel = (type: string) => {
    const labels = {
      CC: 'Cédula de Ciudadanía',
      CE: 'Cédula de Extranjería',
      TI: 'Tarjeta de Identidad',
      PAS: 'Pasaporte',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {owner.firstName} {owner.lastName}
          </DialogTitle>
          <DialogDescription>
            Información detallada del propietario
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span className="font-medium">Documento</span>
              </div>
              <div>
                <Badge variant="secondary" className="mb-1">
                  {getDocumentTypeLabel(owner.documentType)}
                </Badge>
                <p className="text-sm">{owner.documentNumber}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Registro</span>
              </div>
              <p className="text-sm">
                {new Date(owner.createdAt).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Información de Contacto</h3>
            
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{owner.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                  <p className="text-sm">{owner.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                  <p className="text-sm">{owner.address}</p>
                  <p className="text-sm text-muted-foreground">{owner.city}</p>
                </div>
              </div>
            </div>
          </div>

          {owner.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Notas</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {owner.notes}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
