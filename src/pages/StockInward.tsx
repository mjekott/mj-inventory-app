import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockProducts, mockStockMovements } from '@/data/mockData';
import { StockMovement } from '@/types/inventory';
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
import { Plus, ArrowDownToLine, Package, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function StockInward() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');

  const inwardMovements = mockStockMovements.filter((m) => m.type === 'inward');

  const handleSubmit = () => {
    if (!selectedProduct || !quantity || !reason) {
      toast.error('Please fill all required fields');
      return;
    }

    const product = mockProducts.find((p) => p.id === selectedProduct);
    if (!product) return;

    // Simulate adding stock (UI only)
    toast.success(
      `Added ${quantity} units of ${product.name}`,
      {
        description: `Stock updated: ${product.currentStock} → ${
          product.currentStock + parseInt(quantity)
        }`,
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
        title="Stock Inward"
        description="Record incoming stock and inventory additions"
        action={
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Stock
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <ArrowDownToLine className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {inwardMovements.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Inward Entries</p>
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
                  {inwardMovements.reduce((sum, m) => sum + m.quantity, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Units Added (Total)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Today</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inward History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Inward History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Previous Stock</TableHead>
                <TableHead>New Stock</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inwardMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="text-sm">
                    {format(movement.createdAt, 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <ArrowDownToLine className="w-4 h-4 text-success" />
                      </div>
                      <span className="font-medium">{movement.productName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                      +{movement.quantity}
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

      {/* Add Stock Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownToLine className="w-5 h-5 text-success" />
              Add Stock Inward
            </DialogTitle>
            <DialogDescription>
              Record incoming stock for a product
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
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
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  placeholder="PO-2024-XXX"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Purchase Order PO-2024-012, Monthly restock..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {selectedProduct && quantity && (
              <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                <p className="text-sm text-success">
                  <strong>Preview:</strong> Adding {quantity} units to{' '}
                  {mockProducts.find((p) => p.id === selectedProduct)?.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  New stock:{' '}
                  {(mockProducts.find((p) => p.id === selectedProduct)?.currentStock ||
                    0) + parseInt(quantity || '0')}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-success hover:bg-success/90">
              <ArrowDownToLine className="w-4 h-4 mr-2" />
              Add Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
