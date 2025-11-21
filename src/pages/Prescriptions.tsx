import { useState, useEffect } from 'react';
import { Search, Plus, FileText, Download, Eye, Edit, Trash2 } from 'lucide-react';
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
import { PrescriptionFormDialog } from '@/components/prescriptions/PrescriptionFormDialog';
import { PrescriptionDetailsDialog } from '@/components/prescriptions/PrescriptionDetailsDialog';
import { prescriptionService, Prescription } from '@/services/prescriptionService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | undefined>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadPrescriptions();
  }, [page]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await prescriptionService.getAll(page, 10);
      setPrescriptions(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Error al cargar prescripciones:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las prescripciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.medicationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddPrescription = async (newPrescription: any) => {
    try {
      await prescriptionService.create(newPrescription);
      toast({
        title: 'Éxito',
        description: 'Prescripción creada correctamente',
      });
      await loadPrescriptions();
      setIsFormOpen(false);
    } catch (error: any) {
      console.error('Error al crear prescripción:', error);
      const errorMessage = error?.response?.data?.message || 'No se pudo crear la prescripción';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleEditPrescription = async (updatedPrescription: Prescription) => {
    try {
      await prescriptionService.update(updatedPrescription.id, updatedPrescription as any);
      toast({
        title: 'Éxito',
        description: 'Prescripción actualizada correctamente',
      });
      loadPrescriptions();
    } catch (error) {
      console.error('Error al actualizar prescripción:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la prescripción',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await prescriptionService.delete(id);
      toast({
        title: 'Éxito',
        description: 'Prescripción eliminada correctamente',
      });
      loadPrescriptions();
      setIsDetailsOpen(false);
    } catch (error) {
      console.error('Error al eliminar prescripción:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la prescripción',
        variant: 'destructive',
      });
    }
  };

  const handleExport = async (id: number, format: 'PDF' | 'EXCEL') => {
    try {
      const blob = await prescriptionService.exportPrescription(id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescripcion_${id}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: 'Éxito',
        description: `Prescripción exportada en formato ${format}`,
      });
    } catch (error) {
      console.error('Error al exportar prescripción:', error);
      toast({
        title: 'Error',
        description: 'No se pudo exportar la prescripción',
        variant: 'destructive',
      });
    }
  };

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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prescripciones</h1>
          <p className="text-muted-foreground">Gestión de recetas y prescripciones médicas</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Prescripción
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Prescripciones</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por medicamento o paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ACTIVE">Activas</SelectItem>
                  <SelectItem value="COMPLETED">Completadas</SelectItem>
                  <SelectItem value="CANCELLED">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando prescripciones...</div>
          ) : filteredPrescriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay prescripciones registradas
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => (
                <Card key={prescription.id} className="hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">{prescription.medicationName}</h3>
                          {getStatusBadge(prescription)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Paciente:</span> {prescription.patientName || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Dosis:</span> {prescription.dosage}
                          </div>
                          <div>
                            <span className="font-medium">Frecuencia:</span> {prescription.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Duración:</span> {prescription.duration}
                          </div>
                          {prescription.startDate && (
                            <div>
                              <span className="font-medium">Inicio:</span>{' '}
                              {format(new Date(prescription.startDate), 'dd/MM/yyyy', { locale: es })}
                            </div>
                          )}
                          {prescription.endDate && (
                            <div>
                              <span className="font-medium">Fin:</span>{' '}
                              {format(new Date(prescription.endDate), 'dd/MM/yyyy', { locale: es })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPrescription(prescription);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(prescription.id, 'PDF')}
                          title="Exportar PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(prescription.id, 'EXCEL')}
                          title="Exportar Excel"
                        >
                          <FileText className="h-4 w-4" />
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

      <PrescriptionFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddPrescription}
      />

      <PrescriptionDetailsDialog
        open={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedPrescription(undefined);
        }}
        prescription={selectedPrescription}
        onEdit={handleEditPrescription}
        onDelete={handleDelete}
        onExport={handleExport}
      />
    </div>
  );
}

