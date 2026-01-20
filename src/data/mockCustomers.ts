import { Customer, CustomerActivity } from '@/types/customer';

export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Tech Solutions Inc.',
    email: 'orders@techsolutions.com',
    phone: '+1-555-100-2001',
    address: '500 Innovation Drive, Silicon Valley, CA 94025',
    company: 'Tech Solutions Inc.',
    notes: 'Preferred customer, bulk orders',
    totalOrders: 15,
    totalSpent: 12499.50,
    isActive: true,
    createdAt: new Date('2023-06-15'),
    lastOrderAt: new Date('2024-01-10'),
  },
  {
    id: 'cust-2',
    name: 'Creative Agency LLC',
    email: 'purchasing@creative.com',
    phone: '+1-555-200-3002',
    address: '789 Design Blvd, New York, NY 10001',
    company: 'Creative Agency LLC',
    notes: 'Net 30 payment terms',
    totalOrders: 8,
    totalSpent: 5674.90,
    isActive: true,
    createdAt: new Date('2023-09-20'),
    lastOrderAt: new Date('2024-01-12'),
  },
  {
    id: 'cust-3',
    name: 'StartUp Hub',
    email: 'admin@startuphub.io',
    phone: '+1-555-300-4003',
    address: '123 Startup Lane, Austin, TX 78701',
    company: 'StartUp Hub',
    totalOrders: 3,
    totalSpent: 2099.70,
    isActive: true,
    createdAt: new Date('2024-01-05'),
    lastOrderAt: new Date('2024-01-15'),
  },
  {
    id: 'cust-4',
    name: 'Education First',
    email: 'procurement@educationfirst.org',
    phone: '+1-555-400-5004',
    address: '456 Learning Ave, Boston, MA 02108',
    company: 'Education First',
    notes: 'Non-profit, special pricing',
    totalOrders: 22,
    totalSpent: 18750.00,
    isActive: true,
    createdAt: new Date('2023-03-10'),
    lastOrderAt: new Date('2024-01-13'),
  },
  {
    id: 'cust-5',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-500-6005',
    address: '321 Residential St, Miami, FL 33101',
    totalOrders: 2,
    totalSpent: 459.98,
    isActive: true,
    createdAt: new Date('2023-11-28'),
    lastOrderAt: new Date('2023-12-15'),
  },
  {
    id: 'cust-6',
    name: 'Global Enterprises',
    email: 'orders@globalent.com',
    phone: '+1-555-600-7006',
    address: '1000 Corporate Plaza, Chicago, IL 60601',
    company: 'Global Enterprises',
    notes: 'VIP customer',
    totalOrders: 45,
    totalSpent: 89500.00,
    isActive: true,
    createdAt: new Date('2022-08-15'),
    lastOrderAt: new Date('2024-01-14'),
  },
  {
    id: 'cust-7',
    name: 'Small Biz Shop',
    email: 'info@smallbiz.com',
    phone: '+1-555-700-8007',
    address: '55 Main Street, Portland, OR 97201',
    company: 'Small Biz Shop',
    totalOrders: 5,
    totalSpent: 1234.95,
    isActive: false,
    createdAt: new Date('2023-04-20'),
    lastOrderAt: new Date('2023-08-10'),
  },
];

export const mockCustomerActivities: CustomerActivity[] = [
  {
    id: 'act-1',
    customerId: 'cust-1',
    action: 'order_placed',
    description: 'Placed order ORD-2024-001 for $1,099.80',
    timestamp: new Date('2024-01-10T14:30:00'),
    metadata: { orderId: '1', orderNumber: 'ORD-2024-001', amount: 1099.80 },
  },
  {
    id: 'act-2',
    customerId: 'cust-1',
    action: 'login',
    description: 'Logged in from IP 192.168.1.100',
    timestamp: new Date('2024-01-10T14:25:00'),
  },
  {
    id: 'act-3',
    customerId: 'cust-1',
    action: 'viewed_product',
    description: 'Viewed Wireless Keyboard (SKU-001)',
    timestamp: new Date('2024-01-10T14:28:00'),
    metadata: { productId: '1', productName: 'Wireless Keyboard' },
  },
  {
    id: 'act-4',
    customerId: 'cust-2',
    action: 'order_placed',
    description: 'Placed order ORD-2024-002 for $1,674.90',
    timestamp: new Date('2024-01-12T10:15:00'),
    metadata: { orderId: '2', orderNumber: 'ORD-2024-002', amount: 1674.90 },
  },
  {
    id: 'act-5',
    customerId: 'cust-2',
    action: 'profile_updated',
    description: 'Updated phone number and address',
    timestamp: new Date('2024-01-11T09:00:00'),
  },
  {
    id: 'act-6',
    customerId: 'cust-3',
    action: 'order_placed',
    description: 'Placed order ORD-2024-003 for $2,099.70',
    timestamp: new Date('2024-01-15T09:15:00'),
    metadata: { orderId: '3', orderNumber: 'ORD-2024-003', amount: 2099.70 },
  },
  {
    id: 'act-7',
    customerId: 'cust-3',
    action: 'login',
    description: 'Logged in from IP 192.168.2.50',
    timestamp: new Date('2024-01-15T09:10:00'),
  },
  {
    id: 'act-8',
    customerId: 'cust-4',
    action: 'order_placed',
    description: 'Placed order ORD-2024-004 for $1,249.50',
    timestamp: new Date('2024-01-13T11:30:00'),
    metadata: { orderId: '4', orderNumber: 'ORD-2024-004', amount: 1249.50 },
  },
  {
    id: 'act-9',
    customerId: 'cust-6',
    action: 'login',
    description: 'Logged in from IP 10.0.0.55',
    timestamp: new Date('2024-01-14T08:00:00'),
  },
  {
    id: 'act-10',
    customerId: 'cust-6',
    action: 'viewed_product',
    description: 'Viewed Office Chair (SKU-004)',
    timestamp: new Date('2024-01-14T08:15:00'),
    metadata: { productId: '4', productName: 'Office Chair' },
  },
  {
    id: 'act-11',
    customerId: 'cust-7',
    action: 'order_cancelled',
    description: 'Cancelled order ORD-2023-089',
    timestamp: new Date('2023-08-10T16:00:00'),
    metadata: { orderId: 'old-1', orderNumber: 'ORD-2023-089' },
  },
];

// Helper to get customer orders from mockOrders
export const getCustomerOrders = (customerId: string, orders: any[]) => {
  const customer = mockCustomers.find(c => c.id === customerId);
  if (!customer) return [];
  return orders.filter(o => 
    o.customerName === customer.name || 
    o.customerEmail === customer.email
  );
};

// Helper to get customer activities
export const getCustomerActivities = (customerId: string) => {
  return mockCustomerActivities.filter(a => a.customerId === customerId);
};
