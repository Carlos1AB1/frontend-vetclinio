import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, DollarSign, TrendingUp, Users, PawPrint, FileText } from 'lucide-react';

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

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reportes y Estadísticas</h1>
        <p className="text-muted-foreground">Análisis detallado de la actividad de la clínica</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Citas Este Mes</p>
              <p className="text-2xl font-bold text-foreground mt-1">67</p>
              <p className="text-xs text-success mt-1">+12% vs mes anterior</p>
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
              <p className="text-2xl font-bold text-foreground mt-1">$6,700</p>
              <p className="text-xs text-success mt-1">+21% vs mes anterior</p>
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
              <p className="text-2xl font-bold text-foreground mt-1">328</p>
              <p className="text-xs text-info mt-1">+8 este mes</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
              <PawPrint className="h-6 w-6 text-info" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Historias Clínicas</p>
              <p className="text-2xl font-bold text-foreground mt-1">156</p>
              <p className="text-xs text-muted-foreground mt-1">Total registradas</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-chart-2" />
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
