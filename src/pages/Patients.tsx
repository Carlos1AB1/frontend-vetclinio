import { useState } from 'react';
import { Search, Plus, Filter, PawPrint, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockPatients } from '@/data/mockPatients';
import { Patient, Species } from '@/types/patient';
import { PatientFormDialog } from '@/components/patients/PatientFormDialog';
import { PatientDetailsDialog } from '@/components/patients/PatientDetailsDialog';

const speciesLabels: Record<Species, string> = {
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Conejo',
  hamster: 'Hámster',
  other: 'Otro',
};

const speciesColors: Record<Species, string> = {
  dog: 'bg-primary/10 text-primary',
  cat: 'bg-secondary/10 text-secondary',
  bird: 'bg-info/10 text-info',
  rabbit: 'bg-warning/10 text-warning',
  hamster: 'bg-accent/10 text-accent',
  other: 'bg-muted text-muted-foreground',
};

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.breed.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecies = speciesFilter === 'all' || patient.species === speciesFilter;
    
    return matchesSearch && matchesSpecies;
  });

  const handleAddPatient = (newPatient: Omit<Patient, 'id' | 'createdAt'>) => {
    const patient: Patient = {
      ...newPatient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPatients([patient, ...patients]);
  };

  const handleEditPatient = (updatedPatient: Patient) => {
    setPatients(patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)));
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailsOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedPatient(undefined);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedPatient(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
          <p className="text-muted-foreground">Gestión de mascotas registradas</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Paciente
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, propietario o raza..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por especie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las especies</SelectItem>
                  <SelectItem value="dog">Perros</SelectItem>
                  <SelectItem value="cat">Gatos</SelectItem>
                  <SelectItem value="bird">Aves</SelectItem>
                  <SelectItem value="rabbit">Conejos</SelectItem>
                  <SelectItem value="hamster">Hámsters</SelectItem>
                  <SelectItem value="other">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Mostrando {filteredPatients.length} de {patients.length} pacientes
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <CardContent className="p-0">
              <div className="border-b border-border bg-muted/50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <PawPrint className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">{patient.breed}</p>
                    </div>
                  </div>
                  <Badge className={speciesColors[patient.species]}>
                    {speciesLabels[patient.species]}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3 p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Propietario</p>
                    <p className="font-medium text-foreground">{patient.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Edad</p>
                    <p className="font-medium text-foreground">
                      {patient.age} {patient.age === 1 ? 'año' : 'años'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Peso</p>
                    <p className="font-medium text-foreground">{patient.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sexo</p>
                    <p className="font-medium text-foreground capitalize">
                      {patient.sex === 'male' ? 'Macho' : 'Hembra'}
                    </p>
                  </div>
                </div>

                {patient.lastVisit && (
                  <div className="rounded-lg bg-muted/50 p-2 text-xs">
                    <span className="text-muted-foreground">Última visita: </span>
                    <span className="font-medium text-foreground">
                      {new Date(patient.lastVisit).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(patient)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(patient)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PawPrint className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No se encontraron pacientes</h3>
            <p className="text-sm text-muted-foreground">
              Intenta ajustar los filtros de búsqueda
            </p>
          </CardContent>
        </Card>
      )}

      <PatientFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={selectedPatient ? handleEditPatient : handleAddPatient}
        patient={selectedPatient}
      />

      <PatientDetailsDialog
        open={isDetailsOpen}
        onClose={handleCloseDetails}
        patient={selectedPatient}
      />
    </div>
  );
}
