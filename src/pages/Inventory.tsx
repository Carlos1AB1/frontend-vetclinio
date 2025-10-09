import { useState } from 'react';
import { Plus, Search, AlertTriangle, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventoryFormDialog } from '@/components/inventory/InventoryFormDialog';
import { InventoryDetailsDialog } from '@/components/inventory/InventoryDetailsDialog';
import { mockInventory } from '@/data/mockInventory';
import { InventoryItem } from '@/types/inventory';

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddItem = (data: Omit<InventoryItem, 'id' | 'status'>) => {
    const newItem: InventoryItem = {
      ...data,
      id: String(items.length + 1),
      status: data.quantity === 0 ? 'agotado' : data.quantity <= data.minStock ? 'bajo_stock' : 'disponible',
    };
    setItems([...items, newItem]);
    setIsFormOpen(false);
  };

  const handleEditItem = (data: Omit<InventoryItem, 'id' | 'status'>) => {
    if (!selectedItem) return;
    const updatedItem: InventoryItem = {
      ...data,
      id: selectedItem.id,
      status: data.quantity === 0 ? 'agotado' : data.quantity <= data.minStock ? 'bajo_stock' : 'disponible',
    };
    setItems(items.map(item => item.id === selectedItem.id ? updatedItem : item));
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    setIsDetailsOpen(false);
    setSelectedItem(null);
  };

  const getStatusBadge = (status: InventoryItem['status']) => {
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
                        <p className="text-xs text-muted-foreground">Mínimo: {item.minStock}</p>
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
