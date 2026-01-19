import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockProducts, mockStockMovements } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Plus, ArrowUpFromLine, Package, AlertTriangle, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function StockOutward() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [movementType, setMovementType] = useState<'outward' | 'adjustment'>('outward');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');

  const outwardMovements = mockStockMovements.filter(
    (m) => m.type === 'outward' || m.type === 'adjustment'
  );

  const handleSubmit = () => {
    if (!selectedProduct || !quantity || !reason) {
      toast.error('Please fill all required fields');
      return;
    }

    const product = mockProducts.find((p) => p.id === selectedProduct);
    if (!product) return;

    const qty = parseInt(quantity);
    if (movementType === 'outward' && qty > product.currentStock) {
      toast.error('Insufficient stock available');
      return;
    }

    const newStock =
      movementType === 'adjustment'
        ? product.currentStock + qty
        : product.currentStock - qty;

    toast.success(
      movementType === 'outward'
        ? `Removed ${quantity} units from ${product.name}`
        : `Adjusted ${product.name} stock by ${qty > 0 ? '+' : ''}${qty}`,
      {
        description: `Stock updated: ${product.currentStock} → ${newStock}`,
      }
    );

    setIsDialogOpen(false);
    setSelectedProduct('');
    setQuantity('');
    setReason('');
    setReference('');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Stock Outward & Adjustments"
        description="Record outgoing stock, returns, and inventory adjustments"
        action={
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Record Movement
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <ArrowUpFromLine className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {outwardMovements.filter((m) => m.type === 'outward').length}
                </p>
                <p className="text-sm text-muted-foreground">Outward Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <Wrench className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {outwardMovements.filter((m) => m.type === 'adjustment').length}
                </p>
                <p className="text-sm text-muted-foreground">Adjustments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/10">
                <Package className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {outwardMovements
                    .filter((m) => m.type === 'outward')
                    .reduce((sum, m) => sum + m.quantity, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Units Dispatched</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Movement History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Outward & Adjustment History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Previous</TableHead>
                <TableHead>New Stock</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outwardMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="text-sm">
                    {format(movement.createdAt, 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell>
                    {movement.type === 'outward' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                        <ArrowUpFromLine className="w-3 h-3" />
                        Outward
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                        <Wrench className="w-3 h-3" />
                        Adjustment
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{movement.productName}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        movement.type === 'outward'
                          ? 'bg-destructive/10 text-destructive'
                          : movement.quantity > 0
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {movement.type === 'outward'
                        ? `-${movement.quantity}`
                        : movement.quantity > 0
                        ? `+${movement.quantity}`
                        : movement.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {movement.previousStock}
                  </TableCell>
                  <TableCell className="font-medium">{movement.newStock}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {movement.reference || '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {movement.reason}
                  </TableCell>
                  <TableCell>{movement.createdBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Movement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Stock Movement</DialogTitle>
            <DialogDescription>
              Record stock outward or make inventory adjustments
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={movementType}
            onValueChange={(v) => setMovementType(v as 'outward' | 'adjustment')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="outward" className="flex items-center gap-2">
                <ArrowUpFromLine className="w-4 h-4" />
                Outward
              </TabsTrigger>
              <TabsTrigger value="adjustment" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Adjustment
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product *</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{product.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            (Stock: {product.currentStock})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">
                    Quantity * {movementType === 'adjustment' && '(use - for decrease)'}
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder={movementType === 'adjustment' ? '-5 or 5' : 'Enter quantity'}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    placeholder={movementType === 'outward' ? 'ORD-XXX' : 'ADJ-XXX'}
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder={
                    movementType === 'outward'
                      ? 'e.g., Order fulfillment, Return to supplier...'
                      : 'e.g., Damaged goods, Stock count correction...'
                  }
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              {selectedProduct && quantity && (
                <div
                  className={`p-3 rounded-lg border ${
                    movementType === 'outward'
                      ? 'bg-destructive/5 border-destructive/20'
                      : 'bg-warning/5 border-warning/20'
                  }`}
                >
                  <p
                    className={`text-sm ${
                      movementType === 'outward' ? 'text-destructive' : 'text-warning'
                    }`}
                  >
                    <strong>Preview:</strong>{' '}
                    {movementType === 'outward'
                      ? `Removing ${quantity} units from`
                      : `Adjusting by ${parseInt(quantity) > 0 ? '+' : ''}${quantity} units for`}{' '}
                    {mockProducts.find((p) => p.id === selectedProduct)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    New stock:{' '}
                    {movementType === 'outward'
                      ? (mockProducts.find((p) => p.id === selectedProduct)?.currentStock ||
                          0) - Math.abs(parseInt(quantity || '0'))
                      : (mockProducts.find((p) => p.id === selectedProduct)?.currentStock ||
                          0) + parseInt(quantity || '0')}
                  </p>
                </div>
              )}
            </div>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className={
                movementType === 'outward'
                  ? 'bg-destructive hover:bg-destructive/90'
                  : 'bg-warning hover:bg-warning/90'
              }
            >
              {movementType === 'outward' ? (
                <>
                  <ArrowUpFromLine className="w-4 h-4 mr-2" />
                  Remove Stock
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4 mr-2" />
                  Apply Adjustment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
