import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockProducts } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertTriangle,
  Package,
  TrendingDown,
  Bell,
  ArrowDownToLine,
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function LowStockAlerts() {
  const lowStockProducts = mockProducts.filter(
    (p) => p.currentStock <= p.minStock
  );

  const criticalProducts = lowStockProducts.filter(
    (p) => p.currentStock <= p.minStock * 0.5
  );

  const warningProducts = lowStockProducts.filter(
    (p) => p.currentStock > p.minStock * 0.5
  );

  const getStockPercentage = (current: number, min: number) => {
    return Math.min((current / min) * 100, 100);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Low Stock Alerts"
        description="Products that need immediate restocking attention"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">
                  {criticalProducts.length}
                </p>
                <p className="text-sm text-muted-foreground">Critical Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <TrendingDown className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">
                  {warningProducts.length}
                </p>
                <p className="text-sm text-muted-foreground">Low Stock Warning</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted">
                <Bell className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {lowStockProducts.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Stock Section */}
      {criticalProducts.length > 0 && (
        <Card className="mb-6 border-destructive/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Critical Stock Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {criticalProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20"
                >
                  <div className="p-3 rounded-lg bg-destructive/10">
                    <Package className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {product.sku} • {product.category}
                        </p>
                      </div>
                      <Link to="/stock-inward">
                        <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                          <ArrowDownToLine className="w-4 h-4 mr-2" />
                          Restock
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-destructive font-medium">
                          {product.currentStock} units remaining
                        </span>
                        <span className="text-muted-foreground">
                          Min: {product.minStock}
                        </span>
                      </div>
                      <Progress
                        value={getStockPercentage(product.currentStock, product.minStock)}
                        className="h-2 bg-destructive/20"
                      />
                      <p className="text-xs text-destructive">
                        Need to order at least{' '}
                        {product.minStock - product.currentStock} units
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning Stock Section */}
      {warningProducts.length > 0 && (
        <Card className="border-warning/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-warning">
              <TrendingDown className="w-5 h-5" />
              Low Stock Warning
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warningProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                          <Package className="w-4 h-4 text-warning" />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <span className="font-medium text-warning">
                        {product.currentStock}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.minStock}
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <Progress
                          value={getStockPercentage(product.currentStock, product.minStock)}
                          className="h-2 bg-warning/20"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to="/stock-inward">
                        <Button size="sm" variant="outline">
                          <ArrowDownToLine className="w-4 h-4 mr-2" />
                          Restock
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {lowStockProducts.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                All Stock Levels OK
              </h3>
              <p className="text-muted-foreground">
                All products are above their minimum stock levels.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
