export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  registeredCount: number;
  price: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  ticketCount: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'attended';
  registeredAt: Date;
  notes?: string;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  totalRevenue: number;
}
