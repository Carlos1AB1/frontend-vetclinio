import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventoryItem, InventoryFormData } from '@/types/inventory';

interface InventoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InventoryFormData) => void;
  initialData?: InventoryItem;
}

export function InventoryFormDialog({ open, onOpenChange, onSubmit, initialData }: InventoryFormDialogProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<InventoryFormData>({
    defaultValues: initialData || {
      name: '',
      category: 'medicamento',
      description: '',
      quantity: 0,
      unit: '',
      minStock: 0,
      supplier: '',
      cost: 0,
      expirationDate: '',
      lastRestockDate: new Date().toISOString().split('T')[0],
    },
  });

  const category = watch('category');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Modifica la información del producto' : 'Completa los datos del nuevo producto'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                {...register('name', { required: 'El nombre es requerido' })}
                placeholder="Ej: Antibiótico Amoxicilina"
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="category">Categoría *</Label>
              <Select value={category} onValueChange={(value) => setValue('category', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicamento">Medicamento</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="alimento">Alimento</SelectItem>
                  <SelectItem value="equipo">Equipo</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="supplier">Proveedor *</Label>
              <Input
                id="supplier"
                {...register('supplier', { required: 'El proveedor es requerido' })}
                placeholder="Nombre del proveedor"
              />
              {errors.supplier && <p className="text-sm text-destructive mt-1">{errors.supplier.message}</p>}
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descripción del producto"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="quantity">Cantidad Actual *</Label>
              <Input
                id="quantity"
                type="number"
                {...register('quantity', { required: 'La cantidad es requerida', valueAsNumber: true })}
                placeholder="0"
              />
              {errors.quantity && <p className="text-sm text-destructive mt-1">{errors.quantity.message}</p>}
            </div>

            <div>
              <Label htmlFor="unit">Unidad de Medida *</Label>
              <Input
                id="unit"
                {...register('unit', { required: 'La unidad es requerida' })}
                placeholder="Ej: kg, ml, unidades"
              />
              {errors.unit && <p className="text-sm text-destructive mt-1">{errors.unit.message}</p>}
            </div>

            <div>
              <Label htmlFor="minStock">Stock Mínimo *</Label>
              <Input
                id="minStock"
                type="number"
                {...register('minStock', { required: 'El stock mínimo es requerido', valueAsNumber: true })}
                placeholder="0"
              />
              {errors.minStock && <p className="text-sm text-destructive mt-1">{errors.minStock.message}</p>}
            </div>

            <div>
              <Label htmlFor="cost">Costo Unitario ($) *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                {...register('cost', { required: 'El costo es requerido', valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.cost && <p className="text-sm text-destructive mt-1">{errors.cost.message}</p>}
            </div>

            <div>
              <Label htmlFor="expirationDate">Fecha de Vencimiento</Label>
              <Input
                id="expirationDate"
                type="date"
                {...register('expirationDate')}
              />
            </div>

            <div>
              <Label htmlFor="lastRestockDate">Última Reposición *</Label>
              <Input
                id="lastRestockDate"
                type="date"
                {...register('lastRestockDate', { required: 'La fecha es requerida' })}
              />
              {errors.lastRestockDate && <p className="text-sm text-destructive mt-1">{errors.lastRestockDate.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Guardar Cambios' : 'Agregar Producto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
