import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ownerPortalService } from '@/services/ownerPortalService';
import type { ClinicService } from '@/services/clinicService';
import { toast } from 'sonner';

export default function OwnerAvailableServices() {
    const [services, setServices] = useState<ClinicService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            const data = await ownerPortalService.getAvailableServices();
            setServices(data);
        } catch (error) {
            console.error('Error al cargar servicios:', error);
            toast.error('Error al cargar los servicios');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Cargando servicios...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Servicios Disponibles</h1>
                <p className="text-muted-foreground">Conoce los servicios que ofrecemos en nuestra clínica</p>
            </div>

            {services.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">No hay servicios disponibles</p>
                        <p className="text-sm text-muted-foreground">Consulta con la clínica para más información</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <Card key={service.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>{service.name}</CardTitle>
                                        <CardDescription>{service.category}</CardDescription>
                                    </div>
                                    <Badge variant={service.isActive ? 'default' : 'secondary'}>
                                        {service.isActive ? 'Disponible' : 'No disponible'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {service.description && (
                                        <p className="text-sm text-muted-foreground">{service.description}</p>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-2xl font-bold text-primary">
                      ${service.price.toLocaleString()}
                    </span>
                                        {service.durationMinutes && (
                                            <span className="text-sm text-muted-foreground">
                        {service.durationMinutes} min
                      </span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}