import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { mockCustomers, mockCustomerActivities } from '@/data/mockCustomers';
import { mockOrders } from '@/data/mockData';
import { Customer, CustomerActivity } from '@/types/customer';
import { 
  Plus, 
  Search, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  ArrowLeft,
  ShoppingBag,
  Activity,
  DollarSign,
  Calendar,
  User,
  Eye,
  LogIn,
  XCircle,
  Edit,
  Package
} from 'lucide-react';
import { format } from 'date-fns';

export default function Customers() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    notes: '',
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast({
        title: 'Error',
        description: 'Name and email are required',
        variant: 'destructive',
      });
      return;
    }

    const customer: Customer = {
      id: `cust-${Date.now()}`,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone || undefined,
      address: newCustomer.address || undefined,
      company: newCustomer.company || undefined,
      notes: newCustomer.notes || undefined,
      totalOrders: 0,
      totalSpent: 0,
      isActive: true,
      createdAt: new Date(),
    };

    setCustomers([customer, ...customers]);
    setNewCustomer({ name: '', email: '', phone: '', address: '', company: '', notes: '' });
    setIsAddDialogOpen(false);
    toast({
      title: 'Customer Added',
      description: `${customer.name} has been added successfully`,
    });
  };

  const getCustomerOrders = (customer: Customer) => {
    return mockOrders.filter(o => 
      o.customerName === customer.name || 
      o.customerEmail === customer.email
    );
  };

  const getCustomerActivities = (customerId: string): CustomerActivity[] => {
    return mockCustomerActivities.filter(a => a.customerId === customerId);
  };

  const getActivityIcon = (action: CustomerActivity['action']) => {
    switch (action) {
      case 'login':
        return <LogIn className="h-4 w-4" />;
      case 'order_placed':
        return <ShoppingBag className="h-4 w-4" />;
      case 'order_cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'profile_updated':
        return <Edit className="h-4 w-4" />;
      case 'viewed_product':
        return <Eye className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (action: CustomerActivity['action']) => {
    switch (action) {
      case 'login':
        return 'text-blue-500';
      case 'order_placed':
        return 'text-green-500';
      case 'order_cancelled':
        return 'text-red-500';
      case 'profile_updated':
        return 'text-yellow-500';
      case 'viewed_product':
        return 'text-purple-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'processing':
        return 'outline';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Customer Detail View
  if (selectedCustomer) {
    const customerOrders = getCustomerOrders(selectedCustomer);
    const customerActivities = getCustomerActivities(selectedCustomer.id);

    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSelectedCustomer(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{selectedCustomer.name}</h1>
              <p className="text-muted-foreground">{selectedCustomer.email}</p>
            </div>
            <Badge variant={selectedCustomer.isActive ? 'default' : 'secondary'}>
              {selectedCustomer.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">${selectedCustomer.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-lg font-semibold">{format(selectedCustomer.createdAt, 'MMM yyyy')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Package className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Order</p>
                    <p className="text-lg font-semibold">
                      {selectedCustomer.lastOrderAt 
                        ? format(selectedCustomer.lastOrderAt, 'MMM d, yyyy')
                        : 'Never'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="info" className="space-y-4">
            <TabsList>
              <TabsTrigger value="info">Customer Info</TabsTrigger>
              <TabsTrigger value="orders">Orders ({customerOrders.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity Log ({customerActivities.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Full Name</p>
                          <p className="font-medium">{selectedCustomer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{selectedCustomer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{selectedCustomer.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Company</p>
                          <p className="font-medium">{selectedCustomer.company || 'Individual'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="font-medium">{selectedCustomer.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedCustomer.notes && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm bg-muted p-3 rounded-lg">{selectedCustomer.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>All orders placed by this customer</CardDescription>
                </CardHeader>
                <CardContent>
                  {customerOrders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.orderNumber}</TableCell>
                            <TableCell>{format(order.createdAt, 'MMM d, yyyy')}</TableCell>
                            <TableCell>{order.items.length} items</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${order.totalAmount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No orders yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent customer activity and interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {customerActivities.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {customerActivities
                          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                          .map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                            <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.action)}`}>
                              {getActivityIcon(activity.action)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{activity.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(activity.timestamp, 'MMM d, yyyy h:mm a')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No activity recorded</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    );
  }

  // Customer List View
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Customers</h1>
            <p className="text-muted-foreground">Manage your customers and view their activity</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <Card 
              key={customer.id} 
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setSelectedCustomer(customer)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      {customer.company && (
                        <p className="text-sm text-muted-foreground">{customer.company}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={customer.isActive ? 'default' : 'secondary'} className="text-xs">
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-lg font-bold">{customer.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">${customer.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {customer.lastOrderAt ? format(customer.lastOrderAt, 'MMM d') : '-'}
                    </p>
                    <p className="text-xs text-muted-foreground">Last Order</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No customers found</h3>
            <p className="text-muted-foreground">Try adjusting your search or add a new customer</p>
          </div>
        )}

        {/* Add Customer Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Customer name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@email.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1-555-000-0000"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Company name"
                  value={newCustomer.company}
                  onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Full address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any notes about this customer..."
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
