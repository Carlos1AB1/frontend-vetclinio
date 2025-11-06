import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Patient, Species, Sex } from '@/types/patient';
import { toast } from 'sonner';

interface PatientFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (patient: any) => void;
  patient?: Patient;
}

export function PatientFormDialog({ open, onClose, onSubmit, patient }: PatientFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog' as Species,
    breed: '',
    age: '',
    weight: '',
    sex: 'male' as Sex,
    color: '',
    ownerName: '',
    ownerId: '',
    microchip: '',
    dateOfBirth: '',
    observations: '',
    isActive: true,
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        species: patient.species,
        breed: patient.breed,
        age: patient.age.toString(),
        weight: patient.weight.toString(),
        sex: patient.sex,
        color: patient.color,
        ownerName: patient.ownerName,
        ownerId: patient.ownerId,
        microchip: patient.microchip || '',
        dateOfBirth: patient.dateOfBirth || '',
        observations: patient.observations || '',
        isActive: patient.isActive,
      });
    } else {
      setFormData({
        name: '',
        species: 'dog',
        breed: '',
        age: '',
        weight: '',
        sex: 'male',
        color: '',
        ownerName: '',
        ownerId: '',
        microchip: '',
        dateOfBirth: '',
        observations: '',
        isActive: true,
      });
    }
  }, [patient, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.breed || !formData.weight || !formData.ownerName) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar que la fecha de nacimiento sea en el pasado
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (birthDate >= today) {
        toast.error('La fecha de nacimiento debe ser en el pasado');
        return;
      }
    }

    // Transformar los datos al formato que espera el backend
    const patientData = {
      name: formData.name,
      species: formData.species.toUpperCase(), // Convertir a mayúsculas
      breed: formData.breed,
      birthDate: formData.dateOfBirth || null, // Cambiar de dateOfBirth a birthDate
      gender: formData.sex.toUpperCase(), // Cambiar de sex a gender y convertir a MALE/FEMALE
      color: formData.color || null,
      weight: parseFloat(formData.weight),
      microchipNumber: formData.microchip || null,
      allergies: null,
      medicalHistory: null,
      notes: formData.observations || null,
      ownerId: formData.ownerId ? parseInt(formData.ownerId) : 1, // Convertir a número, usar 1 como temporal
      ...(patient && { id: patient.id }),
    };

    console.log('Enviando datos del paciente:', patientData); // Para debug
    onSubmit(patientData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{patient ? 'Editar Paciente' : 'Nuevo Paciente'}</DialogTitle>
          <DialogDescription>
            {patient 
              ? 'Actualiza la información del paciente.' 
              : 'Completa el formulario para registrar un nuevo paciente.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre de la mascota"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="species">Especie *</Label>
              <Select
                value={formData.species}
                onValueChange={(value: Species) => setFormData({ ...formData, species: value })}
              >
                <SelectTrigger id="species">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Perro</SelectItem>
                  <SelectItem value="cat">Gato</SelectItem>
                  <SelectItem value="bird">Ave</SelectItem>
                  <SelectItem value="rabbit">Conejo</SelectItem>
                  <SelectItem value="hamster">Hámster</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="breed">Raza *</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="Raza del animal"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color *</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Color del pelaje"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="age">Edad (años) *</Label>
              <Input
                id="age"
                type="number"
                min="0"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="0.0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex">Sexo *</Label>
              <Select
                value={formData.sex}
                onValueChange={(value: Sex) => setFormData({ ...formData, sex: value })}
              >
                <SelectTrigger id="sex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Macho</SelectItem>
                  <SelectItem value="female">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName">Propietario *</Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder="Nombre del propietario"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="microchip">Microchip</Label>
              <Input
                id="microchip"
                value={formData.microchip}
                onChange={(e) => setFormData({ ...formData, microchip: e.target.value })}
                placeholder="Número de microchip"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
              <Input
                id="dateOfBirth"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Alergias, comportamiento, notas especiales..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {patient ? 'Actualizar' : 'Crear'} Paciente
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
