import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Building2, Clock, Bell, Mail, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const [clinicName, setClinicName] = useState('VetClinic');
  const [clinicAddress, setClinicAddress] = useState('Calle Principal 123');
  const [clinicPhone, setClinicPhone] = useState('+1 234 567 8900');
  const [clinicEmail, setClinicEmail] = useState('info@vetclinic.com');
  const [openingTime, setOpeningTime] = useState('09:00');
  const [closingTime, setClosingTime] = useState('18:00');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  const handleSaveClinicInfo = () => {
    toast({
      title: 'Configuración guardada',
      description: 'La información de la clínica ha sido actualizada correctamente.',
    });
  };

  const handleSaveSchedule = () => {
    toast({
      title: 'Horario guardado',
      description: 'El horario de atención ha sido actualizado correctamente.',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Preferencias guardadas',
      description: 'Las preferencias de notificaciones han sido actualizadas.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground">Administra la configuración general de la clínica</p>
      </div>

      <Tabs defaultValue="clinic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="clinic">
            <Building2 className="mr-2 h-4 w-4" />
            Clínica
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Clock className="mr-2 h-4 w-4" />
            Horarios
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clinic">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Información de la Clínica</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clinicName">Nombre de la Clínica</Label>
                    <Input
                      id="clinicName"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="Nombre de la clínica"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clinicAddress">Dirección</Label>
                    <Textarea
                      id="clinicAddress"
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      placeholder="Dirección completa"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clinicPhone">Teléfono</Label>
                      <Input
                        id="clinicPhone"
                        value={clinicPhone}
                        onChange={(e) => setClinicPhone(e.target.value)}
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    <div>
                      <Label htmlFor="clinicEmail">Email</Label>
                      <Input
                        id="clinicEmail"
                        type="email"
                        value={clinicEmail}
                        onChange={(e) => setClinicEmail(e.target.value)}
                        placeholder="info@vetclinic.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveClinicInfo}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Horario de Atención</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="openingTime">Hora de Apertura</Label>
                      <Input
                        id="openingTime"
                        type="time"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="closingTime">Hora de Cierre</Label>
                      <Input
                        id="closingTime"
                        type="time"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Nota:</strong> Este horario se aplica de lunes a viernes. 
                      Los fines de semana y días festivos requieren configuración especial.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Duración de Citas</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="appointmentDuration">Duración por Defecto (minutos)</Label>
                    <Input
                      id="appointmentDuration"
                      type="number"
                      defaultValue="30"
                      placeholder="30"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveSchedule}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Horario
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Preferencias de Notificaciones</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="emailNotifications" className="font-semibold text-foreground">
                          Notificaciones por Email
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones importantes por correo electrónico
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="smsNotifications" className="font-semibold text-foreground">
                          Notificaciones por SMS
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recibe alertas urgentes por mensaje de texto
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="appointmentReminders" className="font-semibold text-foreground">
                          Recordatorios de Citas
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Envía recordatorios automáticos a los propietarios
                      </p>
                    </div>
                    <Switch
                      id="appointmentReminders"
                      checked={appointmentReminders}
                      onCheckedChange={setAppointmentReminders}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Preferencias
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
