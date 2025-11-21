import { useState, useEffect } from 'react';
import { Search, Plus, FileText, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { InformedConsentFormDialog } from '@/components/informed-consents/InformedConsentFormDialog';
import { InformedConsentDetailsDialog } from '@/components/informed-consents/InformedConsentDetailsDialog';
import { informedConsentService, InformedConsent } from '@/services/informedConsentService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function InformedConsents() {
  const [consents, setConsents] = useState<InformedConsent[]>([]);
  const [pendingConsents, setPendingConsents] = useState<InformedConsent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedConsent, setSelectedConsent] = useState<InformedConsent | undefined>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadConsents();
    loadPendingConsents();
  }, [page, activeTab]);

  const loadConsents = async () => {
    try {
      setLoading(true);
      const response = await informedConsentService.getAll(page, 10);
      setConsents(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Error al cargar consentimientos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los consentimientos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPendingConsents = async () => {
    try {
      const response = await informedConsentService.getPendingConsents();
      setPendingConsents(response || []);
    } catch (error) {
      console.error('Error al cargar consentimientos pendientes:', error);
    }
  };

  const filteredConsents = (activeTab === 'all' ? consents : pendingConsents).filter((consent) => {
    const matchesSearch =
      consent.procedureType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consent.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consent.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleAddConsent = async (newConsent: any) => {
    try {
      await informedConsentService.create(newConsent);
      toast({
        title: 'Éxito',
        description: 'Consentimiento creado correctamente',
      });
      await loadConsents();
      await loadPendingConsents();
      setIsFormOpen(false);
    } catch (error: any) {
      console.error('Error al crear consentimiento:', error);
      const errorMessage = error?.response?.data?.message || 'No se pudo crear el consentimiento';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleSignConsent = async (id: number) => {
    try {
      // Usar el nombre del usuario actual como firma
      const signature = `Firmado digitalmente - ${new Date().toLocaleString('es-ES')}`;
      await informedConsentService.signConsent(id, signature);
      toast({
        title: 'Éxito',
        description: 'Consentimiento firmado correctamente',
      });
      await loadConsents();
      await loadPendingConsents();
      setIsDetailsOpen(false);
    } catch (error) {
      console.error('Error al firmar consentimiento:', error);
      toast({
        title: 'Error',
        description: 'No se pudo firmar el consentimiento',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await informedConsentService.delete(id);
      toast({
        title: 'Éxito',
        description: 'Consentimiento eliminado correctamente',
      });
      loadConsents();
      loadPendingConsents();
      setIsDetailsOpen(false);
    } catch (error) {
      console.error('Error al eliminar consentimiento:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el consentimiento',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (consent: InformedConsent) => {
    if (consent.isSigned) {
      return <Badge variant="default">Firmado</Badge>;
    }
    return <Badge variant="secondary">Pendiente</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Consentimientos Informados</h1>
          <p className="text-muted-foreground">Gestión de documentos de consentimiento informado</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Consentimiento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Consentimientos</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar consentimientos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="pending">
                Pendientes ({pendingConsents.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-4">
              {loading ? (
                <div className="text-center py-8">Cargando consentimientos...</div>
              ) : filteredConsents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay consentimientos registrados
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredConsents.map((consent) => (
                    <Card key={consent.id} className="hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-5 w-5 text-primary" />
                              <h3 className="font-semibold text-lg">{consent.procedureType}</h3>
                              {getStatusBadge(consent)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{consent.procedureDescription || consent.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Paciente:</span> {consent.patientName || 'N/A'}
                              </div>
                              {consent.signedDate && (
                                <div>
                                  <span className="font-medium">Firmado:</span>{' '}
                                  {format(new Date(consent.signedDate), 'dd/MM/yyyy', { locale: es })}
                                </div>
                              )}
                              {consent.createdAt && (
                                <div>
                                  <span className="font-medium">Creado:</span>{' '}
                                  {format(new Date(consent.createdAt), 'dd/MM/yyyy', { locale: es })}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedConsent(consent);
                                setIsDetailsOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {totalPages > 1 && activeTab === 'all' && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {page + 1} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
              >
                Siguiente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <InformedConsentFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddConsent}
      />

      <InformedConsentDetailsDialog
        open={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedConsent(undefined);
        }}
        consent={selectedConsent}
        onSign={handleSignConsent}
        onDelete={handleDelete}
      />
    </div>
  );
}

