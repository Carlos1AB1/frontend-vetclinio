import { useState } from 'react';
import { Search, Plus, Calendar, Activity, FileText, Thermometer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MedicalRecordFormDialog } from '@/components/medical-records/MedicalRecordFormDialog';
import { MedicalRecordDetailsDialog } from '@/components/medical-records/MedicalRecordDetailsDialog';
import type { MedicalRecord } from '@/types/medicalRecord';

export default function MedicalRecords() {
  const [records] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredRecords = records.filter((record) =>
    `${record.patientName} ${record.diagnosis} ${record.veterinarianName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Historias Clínicas</h1>
          <p className="text-muted-foreground mt-1">
            Registro médico y atenciones veterinarias
          </p>
        </div>
        <MedicalRecordFormDialog>
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
            placeholder="Buscar por paciente, diagnóstico o veterinario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="space-y-4">
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
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {record.patientName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {record.veterinarianName}
                  </p>
                </div>
                <Badge variant="secondary">
                  {new Date(record.date).toLocaleDateString('es-CO')}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Motivo</p>
                    <p className="text-sm font-medium truncate">{record.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Peso</p>
                    <p className="text-sm font-medium">{record.weight} kg</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-warning" />
                  <div>
                    <p className="text-xs text-muted-foreground">Temperatura</p>
                    <p className="text-sm font-medium">{record.temperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-info" />
                  <div>
                    <p className="text-xs text-muted-foreground">Próxima Visita</p>
                    <p className="text-sm font-medium">
                      {record.nextVisit ? new Date(record.nextVisit).toLocaleDateString('es-CO') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t space-y-2">
                <div>
                  <p className="text-sm font-medium text-foreground">Diagnóstico:</p>
                  <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Tratamiento:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{record.treatment}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No se encontraron historias clínicas con esos criterios de búsqueda
          </p>
        </Card>
      )}

      {selectedRecord && (
        <MedicalRecordDetailsDialog
          record={selectedRecord}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  );
}
