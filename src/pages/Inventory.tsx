import { useState, useEffect } from 'react';
import { Plus, Search, AlertTriangle, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventoryFormDialog } from '@/components/inventory/InventoryFormDialog';
import { InventoryDetailsDialog } from '@/components/inventory/InventoryDetailsDialog';
import { inventoryService, type InventoryItem } from '@/services';
import { useToast } from '@/hooks/use-toast';

type InventoryStatus = 'disponible' | 'bajo_stock' | 'agotado';
type InventoryItemDisplay = InventoryItem & { status?: InventoryStatus; supplier: string };

export default function Inventory() {
  const [items, setItems] = useState<InventoryItemDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItemDisplay | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const page = await inventoryService.getAll(0, 100, searchTerm);
      const itemsWithStatus = page.content.map(item => ({
        ...item,
        status: (item.quantity === 0 ? 'agotado' : item.quantity <= item.minQuantity ? 'bajo_stock' : 'disponible') as InventoryStatus,
        supplier: item.supplier || 'Sin proveedor',
      }));
      setItems(itemsWithStatus);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudieron cargar los items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddItem = async (data: any) => {
    try {
      await inventoryService.create({
        name: data.name,
        category: data.category,
        description: data.description,
        sku: data.sku,
        quantity: data.quantity,
        unit: data.unit,
        minQuantity: data.minStock || data.minQuantity,
        unitPrice: data.price || data.unitPrice,
        supplier: data.supplier,
        expirationDate: data.expirationDate,
        location: data.location,
      });
      toast({
        title: 'Item agregado',
        description: 'El item se ha agregado al inventario',
      });
      setIsFormOpen(false);
      loadItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo agregar el item',
        variant: 'destructive',
      });
    }
  };

  const handleEditItem = async (data: any) => {
    if (!selectedItem) return;
    try {
      await inventoryService.update(selectedItem.id, {
        name: data.name,
        category: data.category,
        description: data.description,
        quantity: data.quantity,
        minQuantity: data.minStock || data.minQuantity,
        unitPrice: data.price || data.unitPrice,
        supplier: data.supplier,
      });
      toast({
        title: 'Item actualizado',
        description: 'El item se ha actualizado correctamente',
      });
      setIsFormOpen(false);
      setSelectedItem(null);
      loadItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar el item',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await inventoryService.delete(id);
      toast({
        title: 'Item eliminado',
        description: 'El item se ha eliminado del inventario',
      });
      setIsDetailsOpen(false);
      setSelectedItem(null);
      loadItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo eliminar el item',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status?: InventoryStatus) => {
    if (!status) return null;
    const variants = {
      disponible: 'default',
      bajo_stock: 'secondary',
      agotado: 'destructive',
    };
    const labels = {
      disponible: 'Disponible',
      bajo_stock: 'Bajo Stock',
      agotado: 'Agotado',
    };
    return <Badge variant={variants[status] as any}>{labels[status]}</Badge>;
  };

  const lowStockItems = items.filter(item => item.status === 'bajo_stock' || item.status === 'agotado');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventario</h1>
          <p className="text-muted-foreground">Gestiona el stock de medicamentos y materiales</p>
        </div>
        <Button onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-warning bg-warning/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">Alertas de Stock</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {lowStockItems.length} producto(s) con stock bajo o agotado
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="medicamento">Medicamento</SelectItem>
              <SelectItem value="material">Material</SelectItem>
              <SelectItem value="alimento">Alimento</SelectItem>
              <SelectItem value="equipo">Equipo</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="disponible">Disponible</SelectItem>
              <SelectItem value="bajo_stock">Bajo Stock</SelectItem>
              <SelectItem value="agotado">Agotado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No hay productos</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'No se encontraron productos con los filtros aplicados'
                : 'Comienza agregando tu primer producto al inventario'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{item.category}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-foreground">{item.quantity} {item.unit}</p>
                        <p className="text-xs text-muted-foreground">Mínimo: {item.minQuantity}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelectedItem(item); setIsDetailsOpen(true); }}
                      >
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <InventoryFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={selectedItem ? handleEditItem : handleAddItem}
        initialData={selectedItem || undefined}
      />

      <InventoryDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        item={selectedItem}
        onEdit={(item) => { setSelectedItem(item); setIsFormOpen(true); setIsDetailsOpen(false); }}
        onDelete={handleDeleteItem}
      />
    </div>
  );
}
