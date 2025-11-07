import { useState, useEffect } from 'react';
import { Search, Plus, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OwnerFormDialog } from '@/components/owners/OwnerFormDialog';
import { OwnerDetailsDialog } from '@/components/owners/OwnerDetailsDialog';
import { ownerService } from '@/services/ownerService';
import type { Owner } from '@/types/owner';
import { toast } from 'sonner';

export default function Owners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar propietarios al montar el componente
  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      setLoading(true);
      const response = await ownerService.getAll(0, 100, searchTerm);
      setOwners(response.content || []);
    } catch (error) {
      console.error('Error al cargar propietarios:', error);
      toast.error('Error al cargar propietarios');
      setOwners([]); // Asegurar que siempre sea un array
    } finally {
      setLoading(false);
    }
  };

  // Buscar cuando cambia el término de búsqueda (con debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadOwners();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredOwners = searchTerm 
    ? (owners || []).filter((owner) =>
        `${owner.firstName} ${owner.lastName} ${owner.documentNumber} ${owner.email}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : (owners || []);

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
        <OwnerFormDialog onSuccess={loadOwners}>
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

      {loading && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Cargando propietarios...</p>
        </Card>
      )}

      {!loading && filteredOwners.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            {searchTerm 
              ? 'No se encontraron propietarios con esos criterios de búsqueda'
              : 'No hay propietarios registrados. Crea el primero usando el botón "Nuevo Propietario"'}
          </p>
        </Card>
      )}

      {!loading && (
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
