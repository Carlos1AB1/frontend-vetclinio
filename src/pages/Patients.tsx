import { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Filter, PawPrint, Edit, Eye, 
  Dog, Cat, Bird, Rabbit, MoreHorizontal,
  ChevronDown, ArrowUpDown, History, Phone, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PatientFormDialog } from '@/components/patients/PatientFormDialog';
import { PatientDetailsDialog } from '@/components/patients/PatientDetailsDialog';
import { patientService, Patient } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInYears, differenceInMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';

// Iconos minimalistas por especie
const getSpeciesIcon = (species: string) => {
  const s = species.toLowerCase();
  const className = "w-4 h-4";
  if (s === 'dog' || s === 'perro') return <Dog className={className} />;
  if (s === 'cat' || s === 'gato') return <Cat className={className} />;
  if (s === 'bird' || s === 'ave') return <Bird className={className} />;
  if (s === 'rabbit' || s === 'conejo') return <Rabbit className={className} />;
  return <PawPrint className={className} />;
};

const getSpeciesStyle = (species: string) => {
    const s = species.toLowerCase();
    if (s === 'dog') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    if (s === 'cat') return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
};

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await patientService.getAll();
      setPatients(response.content || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Error al cargar listado', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        patient.name.toLowerCase().includes(searchLower) ||
        (patient.ownerName && patient.ownerName.toLowerCase().includes(searchLower)) ||
        (patient.breed && patient.breed.toLowerCase().includes(searchLower));
      
      const matchesSpecies = speciesFilter === 'all' || 
        patient.species.toLowerCase() === speciesFilter.toLowerCase();
      
      return matchesSearch && matchesSpecies;
    });
  }, [patients, searchTerm, speciesFilter]);

  const calculateAge = (dateString?: string) => {
    if (!dateString) return <span className="text-muted-foreground">-</span>;
    const date = new Date(dateString);
    const years = differenceInYears(new Date(), date);
    if (years > 0) return `${years} años`;
    const months = differenceInMonths(new Date(), date);
    return `${months} meses`;
  };

  // Manejo de guardado
  const handleSave = async (data: any) => {
    try {
      if (selectedPatient) {
        await patientService.update(selectedPatient.id, data);
        toast({ title: 'Actualizado', description: 'Paciente actualizado correctamente' });
      } else {
        await patientService.create(data);
        toast({ title: 'Creado', description: 'Paciente registrado correctamente' });
      }
      loadPatients();
      setIsFormOpen(false);
    } catch (error) {
        toast({ title: 'Error', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- HEADER CLEAN --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Pacientes</h1>
            <p className="text-muted-foreground mt-1">
                Directorio clínico y gestión de expedientes.
            </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="hidden sm:flex">
                <ArrowUpDown className="mr-2 h-4 w-4" /> Exportar
            </Button>
            <Button onClick={() => { setSelectedPatient(undefined); setIsFormOpen(true); }} className="shadow-md">
                <Plus className="mr-2 h-4 w-4" /> Nuevo Paciente
            </Button>
        </div>
      </div>

      {/* --- TOOLBAR --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-muted/40 p-2 rounded-xl border">
        <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
                placeholder="Buscar por nombre, chip o propietario..." 
                className="pl-10 bg-background border-none shadow-sm h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground hidden md:block" />
            <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
                <SelectTrigger className="w-full md:w-[200px] h-10 bg-background border-none shadow-sm">
                    <SelectValue placeholder="Especie" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las especies</SelectItem>
                    <SelectItem value="dog">Perros</SelectItem>
                    <SelectItem value="cat">Gatos</SelectItem>
                    <SelectItem value="bird">Aves</SelectItem>
                    <SelectItem value="rabbit">Conejos</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
            <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[300px]">Paciente</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Detalles</TableHead>
                    <TableHead>Peso</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    // Skeleton Loading Rows
                    [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><div className="h-10 w-32 bg-muted/50 rounded animate-pulse" /></TableCell>
                            <TableCell><div className="h-4 w-24 bg-muted/50 rounded animate-pulse" /></TableCell>
                            <TableCell><div className="h-4 w-16 bg-muted/50 rounded animate-pulse" /></TableCell>
                            <TableCell><div className="h-4 w-10 bg-muted/50 rounded animate-pulse" /></TableCell>
                            <TableCell><div className="h-4 w-20 bg-muted/50 rounded animate-pulse" /></TableCell>
                            <TableCell className="text-right"><div className="h-8 w-8 bg-muted/50 rounded animate-pulse inline-block" /></TableCell>
                        </TableRow>
                    ))
                ) : filteredPatients.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-64 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Search className="h-10 w-10 mb-2 opacity-20" />
                                <p>No se encontraron pacientes.</p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : (
                    <AnimatePresence>
                        {filteredPatients.map((patient) => (
                            <motion.tr
                                key={patient.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="group hover:bg-muted/40 transition-colors border-b last:border-0"
                            >
                                {/* Col: Paciente */}
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getSpeciesStyle(patient.species)}`}>
                                            {getSpeciesIcon(patient.species)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">{patient.name}</p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal border-muted-foreground/30 text-muted-foreground">
                                                    {patient.breed || 'Sin raza'}
                                                </Badge>
                                                {patient.microchipNumber && (
                                                    <span className="text-[10px] text-muted-foreground font-mono">
                                                        #{patient.microchipNumber.slice(-4)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Col: Propietario */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 text-sm font-medium">
                                            <User className="w-3 h-3 text-muted-foreground" />
                                            {patient.ownerName}
                                        </div>
                                        {/* Simulación de teléfono si existiera en el modelo */}
                                        {/* <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                            <Phone className="w-3 h-3" />
                                            +57 300 123 4567
                                        </div> */}
                                    </div>
                                </TableCell>

                                {/* Col: Detalles (Edad/Sexo) */}
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm">{calculateAge(patient.birthDate)}</span>
                                        <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                                            {patient.gender === 'MALE' ? 'Macho' : patient.gender === 'FEMALE' ? 'Hembra' : '-'}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Col: Peso */}
                                <TableCell>
                                    {patient.weight ? (
                                        <span className="font-mono text-sm bg-muted/30 px-2 py-1 rounded">
                                            {patient.weight} kg
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">-</span>
                                    )}
                                </TableCell>

                                {/* Col: Registro */}
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {patient.createdAt ? format(new Date(patient.createdAt), 'd MMM yyyy', { locale: es }) : '-'}
                                    </span>
                                </TableCell>

                                {/* Col: Acciones */}
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                                            onClick={() => { setSelectedPatient(patient); setIsDetailsOpen(true); }}
                                            title="Ver Expediente"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 hover:bg-orange-50 hover:text-orange-600"
                                            onClick={() => { setSelectedPatient(patient); setIsFormOpen(true); }}
                                            title="Editar"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                )}
            </TableBody>
        </Table>
      </div>
      
      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
        <p>Mostrando {filteredPatients.length} pacientes</p>
        <p>Última actualización: hace unos segundos</p>
      </div>

      {/* DIALOGS */}
      <PatientFormDialog
        open={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedPatient(undefined); }}
        onSubmit={handleSave}
        patient={selectedPatient as any}
      />

      <PatientDetailsDialog
        open={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setSelectedPatient(undefined); }}
        patient={selectedPatient as any}
      />
    </div>
  );
}