import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { PawPrint } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const success = await login(username, password);

      if (success) {
        const userData = JSON.parse(localStorage.getItem('vetclinic_user') || '{}');
        const roles = userData.roles || [];

        if (roles.includes('OWNER') || roles.includes('ROLE_OWNER')) {
          navigate('/owner/appointments');
        } else if (roles.includes('ADMIN') || roles.includes('VETERINARIAN') || roles.includes('RECEPTIONIST') ||
            roles.includes('ROLE_ADMIN') || roles.includes('ROLE_VETERINARIAN') || roles.includes('ROLE_RECEPTIONIST')) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary mb-2">
              <PawPrint className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}