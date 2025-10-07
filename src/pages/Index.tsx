import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PawPrint, Calendar, Users, FileText, Shield } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <PawPrint className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">VetClinic</h1>
              <p className="text-xs text-muted-foreground">Sistema de Gestión Veterinaria</p>
            </div>
          </div>
          <Button onClick={() => navigate('/login')}>
            Iniciar Sesión
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
              Sistema Integral de Gestión Veterinaria
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Administra tu clínica veterinaria de forma eficiente con nuestro sistema completo de gestión de pacientes, citas, historias clínicas e inventario.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/login')}>
                Comenzar Ahora
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h3 className="mb-12 text-center text-3xl font-bold text-foreground">
              Características Principales
            </h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mt-4 font-semibold text-foreground">Gestión de Citas</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Agenda y controla todas las citas de forma eficiente
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h4 className="mt-4 font-semibold text-foreground">Pacientes y Propietarios</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Base de datos completa de mascotas y dueños
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <h4 className="mt-4 font-semibold text-foreground">Historias Clínicas</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Registro detallado de consultas y tratamientos
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mt-4 font-semibold text-foreground">Sistema Seguro</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Control de roles y permisos para tu equipo
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 VetClinic. Sistema de Gestión Veterinaria.
        </div>
      </footer>
    </div>
  );
};

export default Index;
