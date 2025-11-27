import { useState, useEffect } from 'react';
import { Dog } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ownerPortalService } from '@/services/ownerPortalService';
import type { Patient } from '@/types/patient';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function OwnerMyPets() {
    const [pets, setPets] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPets();
    }, []);

    const loadPets = async () => {
        try {
            setLoading(true);
            const data = await ownerPortalService.getMyPets();
            setPets(data);
        } catch (error) {
            console.error('Error al cargar mascotas:', error);
            toast.error('Error al cargar las mascotas');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Cargando mascotas...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Mis Mascotas</h1>
                <p className="text-muted-foreground">Información de tus mascotas registradas</p>
            </div>

            {pets.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Dog className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">No tienes mascotas registradas</p>
                        <p className="text-sm text-muted-foreground">Contacta con la clínica para registrar tus mascotas</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pets.map((pet) => (
                        <Card key={pet.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>{pet.name}</CardTitle>
                                        <CardDescription>{pet.species} - {pet.breed}</CardDescription>
                                    </div>
                                    <Badge variant={pet.isActive ? 'default' : 'secondary'}>
                                        {pet.isActive ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    {pet.dateOfBirth && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Fecha de nacimiento:</span>
                                            <span className="font-medium">
                        {format(new Date(pet.dateOfBirth), 'dd/MM/yyyy', { locale: es })}
                      </span>
                                        </div>
                                    )}
                                    {pet.age && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Edad:</span>
                                            <span className="font-medium">{pet.age}</span>
                                        </div>
                                    )}
                                    {pet.sex && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Sexo:</span>
                                            <span className="font-medium">
                        {pet.sex === 'male' ? 'Macho' : pet.sex === 'female' ? 'Hembra' : 'Desconocido'}
                      </span>
                                        </div>
                                    )}
                                    {pet.color && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Color:</span>
                                            <span className="font-medium">{pet.color}</span>
                                        </div>
                                    )}
                                    {pet.weight && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Peso:</span>
                                            <span className="font-medium">{pet.weight} kg</span>
                                        </div>
                                    )}
                                    {pet.microchip && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Microchip:</span>
                                            <span className="font-medium">{pet.microchip}</span>
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