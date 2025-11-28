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
import { medicalRecordService } from '@/services/medicalRecordService';
import { patientService } from '@/services';
import { toast } from 'sonner';

interface PrescriptionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (prescription: any) => void;
  prescription?: any;
}

export function PrescriptionFormDialog({ open, onClose, onSubmit, prescription }: PrescriptionFormDialogProps) {
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    medicalRecordId: '',
    patientId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (open) {
      loadMedicalRecords();
      loadPatients();
      if (prescription) {
        setFormData({
          medicalRecordId: prescription.medicalRecordId?.toString() || '',
          patientId: prescription.patientId?.toString() || '',
          medicationName: prescription.medicationName || '',
          dosage: prescription.dosage || '',
          frequency: prescription.frequency || '',
          duration: prescription.duration || '',
          instructions: prescription.instructions || '',
          startDate: prescription.startDate ? new Date(prescription.startDate).toISOString().slice(0, 16) : '',
          endDate: prescription.endDate ? new Date(prescription.endDate).toISOString().slice(0, 16) : '',
        });
      } else {
        setFormData({
          medicalRecordId: '',
          patientId: '',
          medicationName: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
          startDate: '',
          endDate: '',
        });
      }
    }
  }, [open, prescription]);

  const loadMedicalRecords = async () => {
    try {
      const response = await medicalRecordService.getAll(0, 100);
      setMedicalRecords(response.content || []);
    } catch (error) {
      console.error('Error al cargar historias clínicas:', error);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await patientService.getAll(0, 100);
      setPatients(response.content || []);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.medicalRecordId || !formData.patientId || !formData.medicationName) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      const prescriptionData = {
        medicalRecordId: parseInt(formData.medicalRecordId),
        patientId: parseInt(formData.patientId),
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration,
        instructions: formData.instructions || undefined,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      };

      await onSubmit(prescriptionData);
    } catch (error) {
      console.error('Error al guardar prescripción:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{prescription ? 'Editar Prescripción' : 'Nueva Prescripción'}</DialogTitle>
          <DialogDescription>
            {prescription ? 'Modifica los datos de la prescripción' : 'Completa los datos para crear una nueva prescripción'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medicalRecordId">Historia Clínica *</Label>
              <Select
                value={formData.medicalRecordId}
                onValueChange={(value) => setFormData({ ...formData, medicalRecordId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una historia clínica" />
                </SelectTrigger>
                <SelectContent>
                  {medicalRecords.map((record) => (
                    <SelectItem key={record.id} value={record.id.toString()}>
                      {record.patientName || `Historia #${record.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientId">Paciente *</Label>
              <Select
                value={formData.patientId}
                onValueChange={(value) => setFormData({ ...formData, patientId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicationName">Medicamento *</Label>
            <Input
              id="medicationName"
              value={formData.medicationName}
              onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
              placeholder="Ej: Amoxicilina 500mg"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosis *</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="Ej: 500mg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frecuencia *</Label>
              <Input
                id="frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                placeholder="Ej: Cada 12 horas"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duración *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Ej: 7 días"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de Inicio *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de Fin</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instrucciones</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Instrucciones adicionales para el tratamiento..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : prescription ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

