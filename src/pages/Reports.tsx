import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, DollarSign, TrendingUp, Users, PawPrint, FileText, Download, Loader2 } from 'lucide-react';
import { dashboardService, reportService } from '@/services';
import { useToast } from '@/hooks/use-toast';

export default function Reports() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalOwners: 0,
    todayAppointments: 0,
    lowStockItems: 0,
    monthlyRevenue: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const dashboardStats = await dashboardService.getStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleGenerateReport = async (type: 'APPOINTMENTS' | 'PATIENTS' | 'SERVICES', startDate?: string, endDate?: string) => {
    try {
      setGeneratingReport(type);
      let blob: Blob;
      let filename: string;

      switch (type) {
        case 'APPOINTMENTS':
          blob = await reportService.generateAppointmentsReport(startDate, endDate);
          filename = `reporte_citas_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        case 'PATIENTS':
          blob = await reportService.generatePatientsReport();
          filename = `reporte_pacientes_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        case 'SERVICES':
          blob = await reportService.generateServicesReport();
          filename = `reporte_servicios_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }

      reportService.downloadBlob(blob, filename);
      toast({
        title: 'Reporte generado',
        description: 'El reporte se ha descargado exitosamente',
      });
    } catch (error: any) {
      console.error('Error al generar reporte:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo generar el reporte',
        variant: 'destructive',
      });
    } finally {
      setGeneratingReport(null);
    }
  };

  // Datos de ejemplo para gráficos (pueden conectarse a endpoints reales en el futuro)
  const monthlyAppointments = [
    { month: 'Ene', total: 45 },
    { month: 'Feb', total: 52 },
    { month: 'Mar', total: 48 },
    { month: 'Abr', total: 61 },
    { month: 'May', total: 55 },
    { month: 'Jun', total: 67 },
  ];

  const monthlyRevenue = [
    { month: 'Ene', ingresos: 4500 },
    { month: 'Feb', ingresos: 5200 },
    { month: 'Mar', ingresos: 4800 },
    { month: 'Abr', ingresos: 6100 },
    { month: 'May', ingresos: 5500 },
    { month: 'Jun', ingresos: 6700 },
  ];

  const appointmentsByType = [
    { name: 'Consulta General', value: 120, color: 'hsl(var(--primary))' },
    { name: 'Vacunación', value: 85, color: 'hsl(var(--chart-2))' },
    { name: 'Cirugía', value: 35, color: 'hsl(var(--chart-3))' },
    { name: 'Emergencia', value: 25, color: 'hsl(var(--chart-4))' },
    { name: 'Control', value: 63, color: 'hsl(var(--chart-5))' },
  ];

  const topTreatments = [
    { treatment: 'Vacuna Antirrábica', count: 45 },
    { treatment: 'Desparasitación', count: 38 },
    { treatment: 'Control de Peso', count: 32 },
    { treatment: 'Limpieza Dental', count: 28 },
    { treatment: 'Esterilización', count: 22 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground">Análisis detallado de la actividad de la clínica</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleGenerateReport('APPOINTMENTS')}
            disabled={generatingReport !== null}
            variant="outline"
          >
            {generatingReport === 'APPOINTMENTS' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Reporte de Citas
          </Button>
          <Button
            onClick={() => handleGenerateReport('PATIENTS')}
            disabled={generatingReport !== null}
            variant="outline"
          >
            {generatingReport === 'PATIENTS' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Reporte de Pacientes
          </Button>
          <Button
            onClick={() => handleGenerateReport('SERVICES')}
            disabled={generatingReport !== null}
            variant="outline"
          >
            {generatingReport === 'SERVICES' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Reporte de Servicios
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Citas Hoy</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.todayAppointments}</p>
              <p className="text-xs text-muted-foreground mt-1">Citas programadas hoy</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
              <p className="text-2xl font-bold text-foreground mt-1">${stats.monthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Mes actual</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pacientes Activos</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.totalPatients}</p>
              <p className="text-xs text-muted-foreground mt-1">Total registrados</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
              <PawPrint className="h-6 w-6 text-info" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Stock Bajo</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.lowStockItems}</p>
              <p className="text-xs text-warning mt-1">Items requieren atención</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-warning" />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="appointments">Citas</TabsTrigger>
          <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          <TabsTrigger value="treatments">Tratamientos</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Citas por Mes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Distribución por Tipo</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={appointmentsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {appointmentsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Ingresos Mensuales</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ingresos" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--success))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="treatments" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Tratamientos Más Frecuentes</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topTreatments} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="treatment" type="category" stroke="hsl(var(--muted-foreground))" width={150} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
