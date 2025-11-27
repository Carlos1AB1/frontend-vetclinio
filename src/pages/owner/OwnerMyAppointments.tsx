import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ownerPortalService } from '@/services/ownerPortalService';
import type { Appointment } from '@/types/appointment';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    SCHEDULED: 'default',
    CONFIRMED: 'secondary',
    IN_PROGRESS: 'outline',
    COMPLETED: 'secondary',
    CANCELLED: 'destructive',
};

const statusLabels: Record<string, string> = {
    SCHEDULED: 'Programada',
    CONFIRMED: 'Confirmada',
    IN_PROGRESS: 'En Progreso',
    COMPLETED: 'Completada',
    CANCELLED: 'Cancelada',
};

export default function OwnerMyAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            const data = await ownerPortalService.getMyAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Error al cargar citas:', error);
            toast.error('Error al cargar las citas');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Cargando citas...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Mis Citas</h1>
                <p className="text-muted-foreground">Visualiza tus citas agendadas</p>
            </div>

            {appointments.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">No tienes citas agendadas</p>
                        <p className="text-sm text-muted-foreground">Las citas que reserves aparecerán aquí</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {appointments.map((appointment) => (
                        <Card key={appointment.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>{appointment.patientName}</CardTitle>
                                        <CardDescription>
                                            {format(new Date(appointment.scheduledDate), "dd 'de' MMMM 'de' yyyy - HH:mm", { locale: es })}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={statusColors[appointment.status] || 'default'}>
                                        {statusLabels[appointment.status] || appointment.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Veterinario:</span>
                                        <span className="font-medium">{appointment.veterinarianName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tipo de cita:</span>
                                        <span className="font-medium">{appointment.appointmentType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Motivo:</span>
                                        <span className="font-medium">{appointment.reason}</span>
                                    </div>
                                    {appointment.notes && (
                                        <div className="mt-2 pt-2 border-t">
                                            <span className="text-muted-foreground">Notas:</span>
                                            <p className="mt-1">{appointment.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}