import { useState, useEffect } from 'react';
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { agendaService } from '@/services/agendaService';
import { userService } from '@/services/userService';
import type { Appointment } from '@/types/appointment';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Agenda() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [veterinarians, setVeterinarians] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedVeterinarian, setSelectedVeterinarian] = useState<string>('all');
  const [viewType, setViewType] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVeterinarians();
  }, []);

  useEffect(() => {
    loadAgenda();
  }, [selectedDate, selectedVeterinarian, viewType]);

  const loadVeterinarians = async () => {
    try {
      const response = await userService.getAll(0, 100);
      const vets = response.content.filter((user: any) => 
        user.roles?.some((role: any) => role.name === 'VETERINARIAN' || role === 'VETERINARIAN')
      );
      setVeterinarians(vets);
    } catch (error) {
      console.error('Error al cargar veterinarios:', error);
    }
  };

  const loadAgenda = async () => {
    try {
      setLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const vetId = selectedVeterinarian === 'all' ? undefined : selectedVeterinarian;
      
      let response: Appointment[];
      switch (viewType) {
        case 'DAILY':
          response = await agendaService.getDailyView(dateStr, vetId);
          break;
        case 'WEEKLY':
          response = await agendaService.getWeeklyView(dateStr, vetId);
          break;
        case 'MONTHLY':
          response = await agendaService.getMonthlyView(dateStr, vetId);
          break;
        default:
          response = await agendaService.getAgendaView('DAILY', dateStr, vetId);
      }
      
      setAppointments(response || []);
    } catch (error) {
      console.error('Error al cargar agenda:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la agenda',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewType === 'DAILY') {
      setSelectedDate(direction === 'next' ? addDays(selectedDate, 1) : subDays(selectedDate, 1));
    } else if (viewType === 'WEEKLY') {
      setSelectedDate(direction === 'next' ? addWeeks(selectedDate, 1) : subWeeks(selectedDate, 1));
    } else {
      setSelectedDate(direction === 'next' ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      SCHEDULED: { label: 'Programada', variant: 'secondary' as const },
      CONFIRMED: { label: 'Confirmada', variant: 'default' as const },
      IN_PROGRESS: { label: 'En Curso', variant: 'default' as const },
      COMPLETED: { label: 'Completada', variant: 'outline' as const },
      CANCELLED: { label: 'Cancelada', variant: 'destructive' as const },
    };
    const config = variants[status as keyof typeof variants] || variants.SCHEDULED;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const renderDailyView = () => {
    const dayAppointments = appointments.filter(apt => 
      isSameDay(new Date(apt.scheduledDate), selectedDate)
    );

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">
            {format(selectedDate, "EEEE, d 'de' MMMM yyyy", { locale: es })}
          </h2>
        </div>
        {dayAppointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay citas programadas para este día
          </div>
        ) : (
          <div className="space-y-3">
            {dayAppointments
              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .map((apt) => (
                <Card key={apt.id} className="hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {format(new Date(apt.scheduledDate), 'HH:mm', { locale: es })}
                          </span>
                          {getStatusBadge(apt.status)}
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{apt.patientName || 'Sin paciente'}</h3>
                        <p className="text-sm text-muted-foreground">{apt.reason}</p>
                        {apt.veterinarianName && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <User className="inline h-3 w-3 mr-1" />
                            {apt.veterinarianName}
                          </p>
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
  };

  const renderWeeklyView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">
            Semana del {format(weekStart, 'd', { locale: es })} al {format(weekEnd, "d 'de' MMMM yyyy", { locale: es })}
          </h2>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayAppointments = appointments.filter(apt =>
              isSameDay(new Date(apt.scheduledDate), day)
            );
            return (
              <Card key={day.toISOString()} className="min-h-[200px]">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">
                    {format(day, 'EEE', { locale: es })}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {format(day, 'd MMM', { locale: es })}
                  </p>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  {dayAppointments.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center">Sin citas</p>
                  ) : (
                    dayAppointments
                      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                      .map((apt) => (
                        <div
                          key={apt.id}
                          className="text-xs p-2 bg-primary/10 rounded border-l-2 border-primary"
                        >
                          <div className="font-semibold">
                            {format(new Date(apt.scheduledDate), 'HH:mm')}
                          </div>
                          <div className="truncate">{apt.patientName}</div>
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Agrupar por día
    const appointmentsByDay = appointments.reduce((acc, apt) => {
      const day = format(new Date(apt.scheduledDate), 'yyyy-MM-dd');
      if (!acc[day]) acc[day] = [];
      acc[day].push(apt);
      return acc;
    }, {} as Record<string, Appointment[]>);

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">
            {format(selectedDate, "MMMM yyyy", { locale: es })}
          </h2>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
            <div key={day} className="text-center font-semibold text-sm p-2">
              {day}
            </div>
          ))}
          {monthDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayAppointments = appointmentsByDay[dayKey] || [];
            const isToday = isSameDay(day, new Date());
            return (
              <Card
                key={day.toISOString()}
                className={`min-h-[100px] ${isToday ? 'border-2 border-primary' : ''}`}
              >
                <CardContent className="p-2">
                  <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  {dayAppointments.length > 0 && (
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map((apt) => (
                        <div
                          key={apt.id}
                          className="text-xs p-1 bg-primary/10 rounded truncate"
                          title={apt.patientName}
                        >
                          {format(new Date(apt.scheduledDate), 'HH:mm')} - {apt.patientName}
                        </div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{dayAppointments.length - 3} más
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agenda</h1>
          <p className="text-muted-foreground">Visualización de citas médicas</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedVeterinarian} onValueChange={setSelectedVeterinarian}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos los veterinarios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los veterinarios</SelectItem>
              {veterinarians.map((vet) => (
                <SelectItem key={vet.id} value={vet.id}>
                  {vet.firstName} {vet.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vista de Agenda</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                Hoy
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={viewType} onValueChange={(value) => setViewType(value as any)}>
            <TabsList>
              <TabsTrigger value="DAILY">Diaria</TabsTrigger>
              <TabsTrigger value="WEEKLY">Semanal</TabsTrigger>
              <TabsTrigger value="MONTHLY">Mensual</TabsTrigger>
            </TabsList>
            <TabsContent value={viewType} className="mt-4">
              {loading ? (
                <div className="text-center py-8">Cargando agenda...</div>
              ) : (
                <>
                  {viewType === 'DAILY' && renderDailyView()}
                  {viewType === 'WEEKLY' && renderWeeklyView()}
                  {viewType === 'MONTHLY' && renderMonthlyView()}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

