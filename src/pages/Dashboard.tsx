import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { POSTerminal } from '@/components/pos/POSTerminal';
import { mockProducts, mockOrders } from '@/data/mockData';
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const revenueData = [
  { month: 'Jan', revenue: 4000, orders: 24 },
  { month: 'Feb', revenue: 3000, orders: 18 },
  { month: 'Mar', revenue: 5000, orders: 32 },
  { month: 'Apr', revenue: 4500, orders: 28 },
  { month: 'May', revenue: 6000, orders: 40 },
  { month: 'Jun', revenue: 5500, orders: 35 },
];

export default function Dashboard() {
  const lowStockProducts = mockProducts.filter((p) => p.currentStock < p.minStock);
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = mockOrders.filter((o) => o.status === 'pending').length;
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your inventory and orders"
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pos">POS Terminal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Products"
              value={mockProducts.length}
              change="+3 this week"
              changeType="positive"
              icon={Package}
              iconColor="text-info"
              iconBg="bg-info/10"
            />
            <StatCard
              title="Low Stock Items"
              value={lowStockProducts.length}
              change="Needs attention"
              changeType="negative"
              icon={AlertTriangle}
              iconColor="text-warning"
              iconBg="bg-warning/10"
            />
            <StatCard
              title="Pending Orders"
              value={pendingOrders}
              change={`${mockOrders.length} total orders`}
              changeType="neutral"
              icon={ShoppingCart}
              iconColor="text-primary"
              iconBg="bg-primary/10"
            />
            <StatCard
              title="Total Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              change="+12.5% from last month"
              changeType="positive"
              icon={DollarSign}
              iconColor="text-success"
              iconBg="bg-success/10"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--chart-1))"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Order</TableHead>
                      <TableHead className="text-xs">Customer</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="text-sm font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {order.customerName}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="text-sm text-right font-medium">
                          ${order.totalAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pos">
          <POSTerminal />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
