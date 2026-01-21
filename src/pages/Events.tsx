import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarDays,
  Plus,
  Search,
  Users,
  DollarSign,
  Clock,
  MapPin,
  Ticket,
  Eye,
  UserPlus,
  CalendarIcon,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Event, EventRegistration } from '@/types/event';
import { mockEvents, mockEventRegistrations, eventCategories, getEventRegistrations } from '@/data/mockEvents';

export default function Events() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [registrations, setRegistrations] = useState<EventRegistration[]>(mockEventRegistrations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [eventDate, setEventDate] = useState<Date>();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '09:00',
    endTime: '17:00',
    location: '',
    capacity: 50,
    price: 0,
    category: 'Workshop',
  });

  const [registerFormData, setRegisterFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    ticketCount: 1,
    notes: '',
  });

  // Stats
  const stats = useMemo(() => {
    const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
    const totalRegistrations = registrations.filter(r => r.status !== 'cancelled').length;
    const totalRevenue = registrations
      .filter(r => r.status !== 'cancelled')
      .reduce((sum, r) => sum + r.totalAmount, 0);
    return {
      totalEvents: events.length,
      upcomingEvents,
      totalRegistrations,
      totalRevenue,
    };
  }, [events, registrations]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, statusFilter]);

  const handleCreateEvent = () => {
    if (!eventDate || !formData.title) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      date: eventDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      capacity: formData.capacity,
      registeredCount: 0,
      price: formData.price,
      status: 'upcoming',
      category: formData.category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setEvents([newEvent, ...events]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast({
      title: 'Event Created',
      description: `"${newEvent.title}" has been scheduled successfully.`,
    });
  };

  const handleRegister = () => {
    if (!selectedEvent || !registerFormData.customerName || !registerFormData.customerEmail) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const availableSpots = selectedEvent.capacity - selectedEvent.registeredCount;
    if (registerFormData.ticketCount > availableSpots) {
      toast({
        title: 'Not Enough Spots',
        description: `Only ${availableSpots} spots available.`,
        variant: 'destructive',
      });
      return;
    }

    const newRegistration: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId: selectedEvent.id,
      customerId: `cust-${Date.now()}`,
      customerName: registerFormData.customerName,
      customerEmail: registerFormData.customerEmail,
      customerPhone: registerFormData.customerPhone,
      ticketCount: registerFormData.ticketCount,
      totalAmount: selectedEvent.price * registerFormData.ticketCount,
      status: 'confirmed',
      registeredAt: new Date(),
      notes: registerFormData.notes,
    };

    setRegistrations([newRegistration, ...registrations]);
    setEvents(events.map(e => 
      e.id === selectedEvent.id 
        ? { ...e, registeredCount: e.registeredCount + registerFormData.ticketCount }
        : e
    ));
    setSelectedEvent({ ...selectedEvent, registeredCount: selectedEvent.registeredCount + registerFormData.ticketCount });
    setIsRegisterDialogOpen(false);
    resetRegisterForm();
    toast({
      title: 'Registration Confirmed',
      description: `${registerFormData.customerName} registered for ${registerFormData.ticketCount} ticket(s).`,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startTime: '09:00',
      endTime: '17:00',
      location: '',
      capacity: 50,
      price: 0,
      category: 'Workshop',
    });
    setEventDate(undefined);
  };

  const resetRegisterForm = () => {
    setRegisterFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      ticketCount: 1,
      notes: '',
    });
  };

  const getCapacityColor = (registered: number, capacity: number) => {
    const percentage = (registered / capacity) * 100;
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'upcoming': return 'default';
      case 'ongoing': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const eventRegistrations = selectedEvent ? getEventRegistrations(selectedEvent.id) : [];

  return (
    <DashboardLayout>
      <PageHeader
        title="Events"
        description="Manage scheduled events, bookings, and registrations"
        action={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          change={`${stats.upcomingEvents} upcoming`}
          changeType="neutral"
          icon={CalendarDays}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          change="Active scheduling"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-info"
          iconBg="bg-info/10"
        />
        <StatCard
          title="Total Registrations"
          value={stats.totalRegistrations}
          change="Confirmed bookings"
          changeType="positive"
          icon={Users}
          iconColor="text-success"
          iconBg="bg-success/10"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change="From paid events"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-warning"
          iconBg="bg-warning/10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedEvent(event)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{event.title}</CardTitle>
                  <Badge variant={getStatusVariant(event.status)} className="capitalize">
                    {event.status}
                  </Badge>
                </div>
                <Badge variant="outline">{event.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  <span>{format(event.date, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Capacity</span>
                  <span className={cn("text-sm font-medium", getCapacityColor(event.registeredCount, event.capacity))}>
                    {event.registeredCount}/{event.capacity}
                  </span>
                </div>
                <Progress value={(event.registeredCount / event.capacity) * 100} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold">
                  {event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
                </span>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="p-12 text-center">
          <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first event.'}
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Card>
      )}

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
                    <DialogDescription className="mt-1">
                      {format(selectedEvent.date, 'EEEE, MMMM d, yyyy')} • {selectedEvent.startTime} - {selectedEvent.endTime}
                    </DialogDescription>
                  </div>
                  <Badge variant={getStatusVariant(selectedEvent.status)} className="capitalize">
                    {selectedEvent.status}
                  </Badge>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="registrations">
                    Registrations ({registrations.filter(r => r.eventId === selectedEvent.id).length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <p className="text-muted-foreground">{selectedEvent.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-medium">{selectedEvent.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Ticket className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-medium">{selectedEvent.price > 0 ? `$${selectedEvent.price.toFixed(2)}` : 'Free'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Capacity</p>
                        <p className="font-medium">{selectedEvent.registeredCount} / {selectedEvent.capacity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <CalendarDays className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Category</p>
                        <p className="font-medium">{selectedEvent.category}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Registration Progress</span>
                      <span className={cn("text-sm", getCapacityColor(selectedEvent.registeredCount, selectedEvent.capacity))}>
                        {Math.round((selectedEvent.registeredCount / selectedEvent.capacity) * 100)}% Full
                      </span>
                    </div>
                    <Progress value={(selectedEvent.registeredCount / selectedEvent.capacity) * 100} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedEvent.capacity - selectedEvent.registeredCount} spots remaining
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="registrations">
                  <div className="space-y-4">
                    {registrations.filter(r => r.eventId === selectedEvent.id).length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Tickets</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Registered</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {registrations
                            .filter(r => r.eventId === selectedEvent.id)
                            .map((reg) => (
                              <TableRow key={reg.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{reg.customerName}</p>
                                    <p className="text-xs text-muted-foreground">{reg.customerEmail}</p>
                                  </div>
                                </TableCell>
                                <TableCell>{reg.ticketCount}</TableCell>
                                <TableCell>
                                  {reg.totalAmount > 0 ? `$${reg.totalAmount.toFixed(2)}` : 'Free'}
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={
                                      reg.status === 'confirmed' || reg.status === 'attended' 
                                        ? 'default' 
                                        : reg.status === 'pending' 
                                          ? 'secondary' 
                                          : 'destructive'
                                    }
                                    className="capitalize"
                                  >
                                    {reg.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {format(reg.registeredAt, 'MMM d, yyyy')}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No registrations yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-4">
                {selectedEvent.status === 'upcoming' && selectedEvent.registeredCount < selectedEvent.capacity && (
                  <Button onClick={() => setIsRegisterDialogOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register Attendee
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule a new event.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Event description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !eventDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventDate ? format(eventDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventDate}
                      onSelect={setEventDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Event location"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Register Attendee Dialog */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Attendee</DialogTitle>
            <DialogDescription>
              {selectedEvent && `Register for "${selectedEvent.title}"`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                value={registerFormData.customerName}
                onChange={(e) => setRegisterFormData({ ...registerFormData, customerName: e.target.value })}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={registerFormData.customerEmail}
                onChange={(e) => setRegisterFormData({ ...registerFormData, customerEmail: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone</Label>
              <Input
                id="customerPhone"
                value={registerFormData.customerPhone}
                onChange={(e) => setRegisterFormData({ ...registerFormData, customerPhone: e.target.value })}
                placeholder="+1 555-0100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticketCount">Number of Tickets</Label>
              <Input
                id="ticketCount"
                type="number"
                min={1}
                max={selectedEvent ? selectedEvent.capacity - selectedEvent.registeredCount : 10}
                value={registerFormData.ticketCount}
                onChange={(e) => setRegisterFormData({ ...registerFormData, ticketCount: parseInt(e.target.value) || 1 })}
              />
              {selectedEvent && (
                <p className="text-xs text-muted-foreground">
                  {selectedEvent.capacity - selectedEvent.registeredCount} spots available
                </p>
              )}
            </div>

            {selectedEvent && selectedEvent.price > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-bold">${(selectedEvent.price * registerFormData.ticketCount).toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={registerFormData.notes}
                onChange={(e) => setRegisterFormData({ ...registerFormData, notes: e.target.value })}
                placeholder="Any special requirements..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRegister}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm Registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
