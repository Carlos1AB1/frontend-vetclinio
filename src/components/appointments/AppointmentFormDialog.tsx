import { useState, useEffect } from 'react';
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
  FormDescription,
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
import { toast } from 'sonner';
import { appointmentService } from '@/services/appointmentService';
import { patientService } from '@/services/patientService';
import { ownerService } from '@/services/ownerService';
import { userService } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';
import type { Appointment } from '@/types/appointment';

const formSchema = z.object({
  patientId: z.string().min(1, 'Seleccione un paciente'),
  ownerId: z.string().min(1, 'Seleccione un propietario'),
  veterinarianId: z.string().min(1, 'Seleccione un veterinario'),
  scheduledDate: z.string().min(1, 'Fecha y hora son requeridas'),
  appointmentType: z.enum(['CONSULTATION', 'VACCINATION', 'SURGERY', 'CHECKUP', 'EMERGENCY']),
  reason: z.string().min(10, 'El motivo debe tener al menos 10 caracteres'),
  durationMinutes: z.string().min(1, 'Duración es requerida'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AppointmentFormDialogProps {
  appointment?: Appointment;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function AppointmentFormDialog({ appointment, children, onSuccess }: AppointmentFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [veterinarians, setVeterinarians] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: appointment ? {
      patientId: appointment.patientId.toString(),
      ownerId: appointment.ownerId.toString(),
      veterinarianId: appointment.veterinarianId,
      scheduledDate: appointment.scheduledDate,
      appointmentType: appointment.appointmentType,
      reason: appointment.reason,
      durationMinutes: appointment.durationMinutes.toString(),
      notes: appointment.notes || '',
    } : {
      patientId: '',
      ownerId: '',
      veterinarianId: user?.id || '',
      scheduledDate: new Date().toISOString().slice(0, 16),
      appointmentType: 'CONSULTATION',
      reason: '',
      durationMinutes: '30',
      notes: '',
    },
  });

  useEffect(() => {
    if (open) {
      loadRealData();
    }
  }, [open]);

  const loadRealData = async () => {
    setLoadingData(true);
    try {
      console.log('🔄 Cargando datos reales desde backend...');
      
      const [patientsRes, ownersRes, usersRes] = await Promise.all([
        patientService.getAll(0, 100),
        ownerService.getAll(0, 100),
        userService.getAll(0, 100),
      ]);

      console.log('✅ Pacientes:', patientsRes.content);
      console.log('✅ Propietarios:', ownersRes.content);
      console.log('✅ Veterinarios:', usersRes.content);

      setPatients(patientsRes.content || []);
      setOwners(ownersRes.content || []);
      setVeterinarians(usersRes.content || []);

      if (user && !appointment) {
        form.setValue('veterinarianId', user.id);
      }
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      toast.error('Error al cargar datos del formulario');
      setPatients([]);
      setOwners([]);
      setVeterinarians([]);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const payload = {
        patientId: parseInt(data.patientId),
        ownerId: parseInt(data.ownerId),
        veterinarianId: data.veterinarianId,
        scheduledDate: data.scheduledDate,
        appointmentType: data.appointmentType,
        reason: data.reason,
        durationMinutes: parseInt(data.durationMinutes),
        notes: data.notes || undefined,
      };

      console.log('📤 Enviando al backend:', payload);

      if (appointment) {
        await appointmentService.update(appointment.id, payload);
        toast.success('Cita actualizada exitosamente');
      } else {
        await appointmentService.create(payload);
        toast.success('Cita creada exitosamente');
      }
      
      console.log('✅ Cita guardada, cerrando diálogo y llamando onSuccess...');
      setOpen(false);
      form.reset();
      
      if (onSuccess) {
        console.log('🔄 Ejecutando onSuccess callback...');
        onSuccess();
      } else {
        console.warn('⚠️ onSuccess no está definido!');
      }
    } catch (error: any) {
      console.error('❌ Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al guardar';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointment ? 'Editar Cita' : 'Nueva Cita'}
          </DialogTitle>
          <DialogDescription>
            {appointment ? 'Actualiza la información de la cita' : 'Programa una nueva cita médica'}
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
                    <FormLabel>Paciente *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={loadingData || !!appointment}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar paciente REAL" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingData ? (
                          <SelectItem value="_loading" disabled>Cargando pacientes...</SelectItem>
                        ) : patients.length === 0 ? (
                          <SelectItem value="_empty" disabled>No hay pacientes disponibles</SelectItem>
                        ) : (
                          patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              {patient.name} - {patient.species} ({patient.ownerName})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Datos cargados desde el backend
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Propietario *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={loadingData}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar propietario REAL" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingData ? (
                          <SelectItem value="_loading" disabled>Cargando propietarios...</SelectItem>
                        ) : owners.length === 0 ? (
                          <SelectItem value="_empty" disabled>No hay propietarios disponibles</SelectItem>
                        ) : (
                          owners.map((owner) => (
                            <SelectItem key={owner.id} value={owner.id.toString()}>
                              {owner.firstName} {owner.lastName} - {owner.email}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Datos cargados desde el backend
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="veterinarianId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veterinario *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={loadingData}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar veterinario REAL" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingData ? (
                        <SelectItem value="_loading" disabled>Cargando veterinarios...</SelectItem>
                      ) : veterinarians.length === 0 ? (
                        <SelectItem value="_empty" disabled>No hay veterinarios disponibles</SelectItem>
                      ) : (
                        veterinarians.map((vet) => (
                          <SelectItem key={vet.id} value={vet.id}>
                            {vet.firstName} {vet.lastName} - {vet.username}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Datos cargados desde el backend
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha y Hora de la Cita *</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        min={new Date().toISOString().slice(0, 16)}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Debe ser una fecha futura
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (minutos) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="15"
                        max="480"
                        placeholder="30"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mínimo 15, máximo 480 minutos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="appointmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Cita *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CONSULTATION">🩺 Consulta</SelectItem>
                      <SelectItem value="VACCINATION">💉 Vacunación</SelectItem>
                      <SelectItem value="SURGERY">🏥 Cirugía</SelectItem>
                      <SelectItem value="CHECKUP">📋 Chequeo</SelectItem>
                      <SelectItem value="EMERGENCY">🚨 Emergencia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de la Consulta *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describa el motivo de la cita..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Información adicional..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : appointment ? 'Actualizar' : 'Crear Cita'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
