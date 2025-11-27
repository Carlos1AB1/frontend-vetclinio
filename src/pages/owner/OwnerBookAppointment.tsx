import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar } from 'lucide-react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ownerPortalService } from '@/services/ownerPortalService';
import { userService } from '@/services/userService';
import type { Patient } from '@/types/patient';
import type { User } from '@/contexts/AuthContext';

const formSchema = z.object({
    patientId: z.string().min(1, 'Selecciona una mascota'),
    veterinarianId: z.string().min(1, 'Selecciona un veterinario'),
    scheduledDate: z.string().min(1, 'Fecha y hora son requeridas'),
    appointmentType: z.enum(['CONSULTATION', 'VACCINATION', 'SURGERY', 'CHECKUP', 'EMERGENCY'], {
        errorMap: () => ({ message: 'Selecciona el tipo de cita' }),
    }),
    reason: z.string().min(10, 'El motivo debe tener al menos 10 caracteres'),
    durationMinutes: z.number().min(15, 'Duración mínima de 15 minutos'),
    notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function OwnerBookAppointment() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pets, setPets] = useState<Patient[]>([]);
    const [veterinarians, setVeterinarians] = useState<User[]>([]);
    const [ownerId, setOwnerId] = useState<string>('');

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            patientId: '',
            veterinarianId: '',
            scheduledDate: '',
            appointmentType: 'CONSULTATION',
            reason: '',
            durationMinutes: 30,
            notes: '',
        },
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            // Obtener el username del usuario desde localStorage
            const userStr = localStorage.getItem('vetclinic_user');
            if (!userStr) {
                toast.error('No se pudo obtener la información del usuario');
                navigate('/login');
                return;
            }

            const localUser = JSON.parse(userStr);
            const username = localUser.username;

            // Obtener el usuario completo desde el backend para tener el UUID real
            const fullUser = await userService.getByUsername(username);
            const userId = fullUser.id; // Este es el UUID real

            // Obtener el ownerId usando el UUID
            const ownerData = await ownerPortalService.getOwnerByUserId(userId);
            setOwnerId(ownerData.id);

            // Cargar mascotas y veterinarios
            const [petsData, usersData] = await Promise.all([
                ownerPortalService.getMyPets(),
                userService.getAll(0, 100),
            ]);

            setPets(petsData);

            // Filtrar solo veterinarios usando el array roles
            const vetList = usersData.content.filter((u: User) => {
                if (!u.roles) return false;
                return u.roles.some((roleName: string) =>
                    roleName === 'VETERINARIAN' || roleName === 'ROLE_VETERINARIAN'
                );
            });
            setVeterinarians(vetList);
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            toast.error('Error al cargar los datos necesarios');
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);

            if (!ownerId) {
                toast.error('No se pudo obtener el ID del propietario');
                return;
            }

            // Convertir la fecha al formato ISO
            const scheduledDateTime = new Date(data.scheduledDate).toISOString();

            const appointmentData = {
                ownerId: parseInt(ownerId),
                patientId: parseInt(data.patientId),
                veterinarianId: data.veterinarianId,
                scheduledDate: scheduledDateTime,
                appointmentType: data.appointmentType,
                reason: data.reason,
                durationMinutes: data.durationMinutes,
                notes: data.notes || '',
            };

            await ownerPortalService.createAppointment(appointmentData);

            toast.success('Cita reservada exitosamente');
            navigate('/owner/appointments');
        } catch (error) {
            console.error('Error al crear cita:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : 'Error al reservar la cita';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Reservar Cita</h1>
                <p className="text-muted-foreground">Agenda una cita para tus mascotas</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Nueva Cita</CardTitle>
                    <CardDescription>Completa el formulario para reservar una cita</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="patientId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mascota</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione una mascota" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {pets.map((pet) => (
                                                        <SelectItem key={pet.id} value={pet.id.toString()}>
                                                            {pet.name} - {pet.species}
                                                        </SelectItem>
                                                    ))}
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
                                                        <SelectValue placeholder="Seleccione un veterinario" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {veterinarians.map((vet) => (
                                                        <SelectItem key={vet.id} value={vet.id}>
                                                            Dr(a). {vet.fullName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="scheduledDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha y Hora</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="datetime-local"
                                                        className="pl-10"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="appointmentType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Cita</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione el tipo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="CONSULTATION">Consulta General</SelectItem>
                                                    <SelectItem value="VACCINATION">Vacunación</SelectItem>
                                                    <SelectItem value="SURGERY">Cirugía</SelectItem>
                                                    <SelectItem value="EMERGENCY">Emergencia</SelectItem>
                                                    <SelectItem value="CHECKUP">Control</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="durationMinutes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duración (minutos)</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                            defaultValue={field.value.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione la duración" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="15">15 minutos</SelectItem>
                                                <SelectItem value="30">30 minutos</SelectItem>
                                                <SelectItem value="45">45 minutos</SelectItem>
                                                <SelectItem value="60">60 minutos</SelectItem>
                                                <SelectItem value="90">90 minutos</SelectItem>
                                                <SelectItem value="120">120 minutos</SelectItem>
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
                                        <FormLabel>Motivo de la Cita</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe el motivo de la consulta..."
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
                                    onClick={() => navigate('/owner/appointments')}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Reservando...' : 'Reservar Cita'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}