import { useState } from 'react';
import { Search, Plus, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OwnerFormDialog } from '@/components/owners/OwnerFormDialog';
import { OwnerDetailsDialog } from '@/components/owners/OwnerDetailsDialog';
import type { Owner } from '@/types/owner';

export default function Owners() {
  const [owners] = useState<Owner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredOwners = owners.filter((owner) =>
    `${owner.firstName} ${owner.lastName} ${owner.documentNumber} ${owner.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getDocumentTypeLabel = (type: string) => {
    const labels = {
      CC: 'Cédula',
      CE: 'Cédula Extranjería',
      TI: 'Tarjeta Identidad',
      PAS: 'Pasaporte',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Propietarios</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de clientes y propietarios de mascotas
          </p>
        </div>
        <OwnerFormDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Propietario
          </Button>
        </OwnerFormDialog>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nombre, documento o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOwners.map((owner) => (
          <Card
            key={owner.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedOwner(owner);
              setIsDetailsOpen(true);
            }}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {owner.firstName} {owner.lastName}
                  </h3>
                  <Badge variant="secondary" className="mt-1">
                    {getDocumentTypeLabel(owner.documentType)} {owner.documentNumber}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{owner.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{owner.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{owner.city}</span>
                </div>
                {owner.notes && (
                  <div className="flex items-start gap-2 pt-2 border-t">
                    <FileText className="h-4 w-4 mt-0.5" />
                    <span className="line-clamp-2">{owner.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredOwners.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No se encontraron propietarios con esos criterios de búsqueda
          </p>
        </Card>
      )}

      {selectedOwner && (
        <OwnerDetailsDialog
          owner={selectedOwner}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  );
}
