import { useState, useEffect } from 'react';
import { Search, Plus, Briefcase, Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ServiceFormDialog } from '@/components/services/ServiceFormDialog';
import { ServiceDetailsDialog } from '@/components/services/ServiceDetailsDialog';
import { clinicService, ClinicService } from '@/services/clinicService';
import { useToast } from '@/hooks/use-toast';

export default function Services() {
  const [services, setServices] = useState<ClinicService[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ClinicService | undefined>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadServices();
  }, [page]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await clinicService.getAllPaginated(page, 10);
      setServices(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los servicios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(services.map(s => s.category)));

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && service.isActive) ||
      (statusFilter === 'inactive' && !service.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddService = async (newService: any) => {
    try {
      await clinicService.create(newService);
      toast({
        title: 'Éxito',
        description: 'Servicio creado correctamente',
      });
      await loadServices();
      setIsFormOpen(false);
    } catch (error: any) {
      console.error('Error al crear servicio:', error);
      let errorMessage = 'No se pudo crear el servicio';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.errors) {
        // Si hay errores de validación, mostrar el primero
        const errors = error.response.data.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          errorMessage = errors[0];
        } else if (typeof errors === 'object') {
          const firstError = Object.values(errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
        }
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleEditService = async (updatedService: ClinicService) => {
    try {
      await clinicService.update(updatedService.id, updatedService as any);
      toast({
        title: 'Éxito',
        description: 'Servicio actualizado correctamente',
      });
      loadServices();
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el servicio',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await clinicService.delete(id);
      toast({
        title: 'Éxito',
        description: 'Servicio eliminado correctamente',
      });
      loadServices();
      setIsDetailsOpen(false);
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el servicio',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Servicios</h1>
          <p className="text-muted-foreground">Gestión de servicios ofrecidos por la clínica</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Servicio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Servicios</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando servicios...</div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay servicios registrados
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <Card key={service.id} className="hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">{service.name}</h3>
                          <Badge variant={service.isActive ? 'default' : 'secondary'}>
                            {service.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                          <Badge variant="outline">{service.category}</Badge>
                        </div>
                        {service.description && (
                          <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                        )}
                        <div className="flex gap-4 text-sm">
                          <div>
                            <span className="font-medium">Precio:</span>{' '}
                            ${service.price?.toLocaleString('es-CO') || '0'}
                          </div>
                          {service.durationMinutes && (
                            <div>
                              <span className="font-medium">Duración:</span> {service.durationMinutes} min
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedService(service);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {page + 1} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
              >
                Siguiente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ServiceFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddService}
      />

      <ServiceDetailsDialog
        open={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedService(undefined);
        }}
        service={selectedService}
        onEdit={handleEditService}
        onDelete={handleDelete}
      />
    </div>
  );
}

