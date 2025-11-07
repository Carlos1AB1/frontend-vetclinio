import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Activity, FileText, Thermometer, Weight, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MedicalRecordFormDialog } from '@/components/medical-records/MedicalRecordFormDialog';
import { MedicalRecordDetailsDialog } from '@/components/medical-records/MedicalRecordDetailsDialog';
import { medicalRecordService } from '@/services/medicalRecordService';
import type { MedicalRecord } from '@/types/medicalRecord';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await medicalRecordService.getAll(0, 100, searchTerm);
      setRecords(response.content || []);
    } catch (error) {
      console.error('Error al cargar historias clínicas:', error);
      toast.error('Error al cargar historias clínicas');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRecords();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredRecords = searchTerm
    ? (records || []).filter((record) =>
        `${record.patientName} ${record.veterinarianName} ${record.diagnosis} ${record.treatment}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : (records || []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "d/MM/yyyy HH:mm", { locale: es });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Historias Clínicas</h1>
          <p className="text-muted-foreground mt-1">
            Registros médicos y consultas veterinarias
          </p>
        </div>
        <MedicalRecordFormDialog onSuccess={loadRecords}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Historia Clínica
          </Button>
        </MedicalRecordFormDialog>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por paciente, veterinario, diagnóstico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {loading && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Cargando historias clínicas...</p>
        </Card>
      )}

      {!loading && filteredRecords.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {searchTerm
              ? 'No se encontraron historias clínicas con esos criterios'
              : 'No hay historias clínicas registradas. Crea la primera usando el botón "Nueva Historia Clínica"'}
          </p>
        </Card>
      )}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {filteredRecords.map((record) => (
            <Card
              key={record.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedRecord(record);
                setIsDetailsOpen(true);
              }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">
                      {record.patientName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateTime(record.recordDate)}</span>
                    </div>
                  </div>
                  {record.followUpRequired && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Seguimiento
                    </Badge>
                  )}
                </div>

                {/* Veterinario */}
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Veterinario:</span>
                  <span className="font-medium">{record.veterinarianName}</span>
                </div>

                {/* Signos Vitales */}
                <div className="grid grid-cols-2 gap-3">
                  {record.weight && (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <Weight className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Peso</p>
                        <p className="font-semibold">{record.weight} kg</p>
                      </div>
                    </div>
                  )}
                  {record.temperature && (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Temperatura</p>
                        <p className="font-semibold">{record.temperature}°C</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Diagnóstico */}
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Diagnóstico</p>
                  <p className="text-sm font-medium line-clamp-2">{record.diagnosis}</p>
                </div>

                {/* Tratamiento */}
                <div className="pb-2">
                  <p className="text-xs text-muted-foreground mb-1">Tratamiento</p>
                  <p className="text-sm line-clamp-2">{record.treatment}</p>
                </div>

                {/* Follow-up */}
                {record.followUpRequired && record.followUpDate && (
                  <div className="pt-3 border-t">
                    <Badge variant="outline" className="w-full justify-start">
                      <Calendar className="h-3 w-3 mr-2" />
                      Próxima visita: {formatDate(record.followUpDate)}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedRecord && (
        <MedicalRecordDetailsDialog
          record={selectedRecord}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onEdit={() => {
            setIsDetailsOpen(false);
          }}
          onDelete={async () => {
            try {
              await medicalRecordService.delete(selectedRecord.id);
              toast.success('Historia clínica eliminada exitosamente');
              setIsDetailsOpen(false);
              loadRecords();
            } catch (error) {
              toast.error('Error al eliminar la historia clínica');
            }
          }}
        />
      )}
    </div>
  );
}

