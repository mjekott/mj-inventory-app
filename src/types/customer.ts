export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
  totalOrders: number;
  totalSpent: number;
  isActive: boolean;
  createdAt: Date;
  lastOrderAt?: Date;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  action: 'login' | 'order_placed' | 'order_cancelled' | 'profile_updated' | 'viewed_product';
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
