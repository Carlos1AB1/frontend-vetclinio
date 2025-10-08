import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { MedicalRecord } from '@/types/medicalRecord';

const formSchema = z.object({
  patientId: z.string().min(1, 'Seleccione un paciente'),
  veterinarianId: z.string().min(1, 'Seleccione un veterinario'),
  appointmentId: z.string().optional(),
  date: z.string().min(1, 'Fecha es requerida'),
  reason: z.string().min(5, 'Motivo debe tener al menos 5 caracteres'),
  symptoms: z.string().min(5, 'Síntomas debe tener al menos 5 caracteres'),
  diagnosis: z.string().min(5, 'Diagnóstico debe tener al menos 5 caracteres'),
  treatment: z.string().min(5, 'Tratamiento debe tener al menos 5 caracteres'),
  prescriptions: z.string().optional(),
  weight: z.number().positive('Peso debe ser positivo').optional(),
  temperature: z.number().min(35).max(42, 'Temperatura fuera de rango').optional(),
  heartRate: z.number().positive('Frecuencia cardíaca debe ser positiva').optional(),
  observations: z.string().optional(),
  nextVisit: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MedicalRecordFormDialogProps {
  record?: MedicalRecord;
  children: React.ReactNode;
}

export function MedicalRecordFormDialog({ record, children }: MedicalRecordFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: record ? {
      patientId: record.patientId,
      veterinarianId: record.veterinarianId,
      appointmentId: record.appointmentId || '',
      date: record.date,
      reason: record.reason,
      symptoms: record.symptoms,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      prescriptions: record.prescriptions || '',
      weight: record.weight,
      temperature: record.temperature,
      heartRate: record.heartRate,
      observations: record.observations || '',
      nextVisit: record.nextVisit || '',
    } : {
      patientId: '',
      veterinarianId: '',
      appointmentId: '',
      date: new Date().toISOString().split('T')[0],
      reason: '',
      symptoms: '',
      diagnosis: '',
      treatment: '',
      prescriptions: '',
      weight: undefined,
      temperature: undefined,
      heartRate: undefined,
      observations: '',
      nextVisit: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(record ? 'Actualizar historia clínica:' : 'Crear historia clínica:', data);
    toast({
      title: record ? 'Historia clínica actualizada' : 'Historia clínica creada',
      description: `El registro ha sido ${record ? 'actualizado' : 'creado'} exitosamente.`,
    });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {record ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
          </DialogTitle>
          <DialogDescription>
            {record ? 'Actualiza el registro médico' : 'Registra una nueva atención veterinaria'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paciente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar paciente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pet-1">Max (Perro)</SelectItem>
                        <SelectItem value="pet-2">Luna (Gato)</SelectItem>
                        <SelectItem value="pet-3">Rocky (Perro)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="veterinarianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veterinario</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar veterinario" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vet-1">Dr. Juan Pérez</SelectItem>
                        <SelectItem value="vet-2">Dra. Ana López</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Atención</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nextVisit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Próxima Visita (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de Consulta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Vacunación, Control, Emergencia..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Síntomas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describa los síntomas observados..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="25.5"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperatura (°C)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="38.5"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heartRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia Cardíaca</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="90"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnóstico</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Diagnóstico médico..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tratamiento</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describa el tratamiento indicado..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prescriptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prescripciones (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Medicamentos y dosificación..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observaciones adicionales..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {record ? 'Actualizar' : 'Crear'} Historia Clínica
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
