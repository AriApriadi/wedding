'use client';

import { useEffect, useState } from 'react';
import WeddingLayout from '@/components/ui/wedding-layout';
import Header from '@/components/ui/header';
import WeddingCard from '@/components/ui/wedding-card';
import TaskList from '@/components/tasks/task-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Users, DollarSign, CheckCircle, X } from 'lucide-react';
import { format } from 'date-fns';

// Mock data for the dashboard
const mockWeddings = [
  {
    id: '1',
    title: "Sarah & John's Wedding",
    coupleNames: "Sarah Johnson & John Smith",
    date: new Date(2025, 5, 15),
    location: "Beach Resort, Maldives",
    status: 'confirmed' as const,
    guestCount: 120
  },
  {
    id: '2',
    title: "Emma & Michael's Wedding",
    coupleNames: "Emma Wilson & Michael Brown",
    date: new Date(2025, 7, 22),
    location: "Garden Venue, California",
    status: 'planning' as const,
    guestCount: 85
  },
  {
    id: '3',
    title: "Lisa & David's Wedding",
    coupleNames: "Lisa Chen & David Wilson",
    date: new Date(2024, 11, 10),
    location: "Historic Castle, Italy",
    status: 'completed' as const,
    guestCount: 200
  }
];

const mockTasks = [
  {
    id: '1',
    title: 'Book Catering Service',
    description: 'Finalize menu and catering contract',
    dueDate: new Date(2025, 3, 15),
    assignee: 'Sarah Johnson',
    status: 'in_progress' as const
  },
  {
    id: '2',
    title: 'Order Wedding Invitations',
    description: 'Select design and place order with printer',
    dueDate: new Date(2025, 2, 20),
    assignee: 'John Smith',
    status: 'todo' as const
  },
  {
    id: '3',
    title: 'Confirm Venue',
    description: 'Sign final contract and make payment',
    dueDate: new Date(2025, 1, 28),
    assignee: 'You',
    status: 'done' as const
  }
];

const OrganizerDashboard = () => {
  const [stats, setStats] = useState({
    totalWeddings: 0,
    upcomingEvents: 0,
    pendingTasks: 0,
    totalRevenue: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWedding, setNewWedding] = useState({
    title: '',
    coupleNames: '',
    date: '',
    location: '',
    guestCount: 0
  });

  const [weddings, setWeddings] = useState(mockWeddings);

  useEffect(() => {
    // In a real app, this would come from an API
    setStats({
      totalWeddings: weddings.length,
      upcomingEvents: weddings.filter(w => 
        w.status !== 'completed' && w.date > new Date()
      ).length,
      pendingTasks: mockTasks.filter(t => t.status !== 'done').length,
      totalRevenue: 125000 // Mock revenue value
    });
  }, [weddings]);

  const handleAddWedding = () => {
    if (!newWedding.title || !newWedding.coupleNames || !newWedding.date) return;
    
    const weddingToAdd = {
      id: (weddings.length + 1).toString(),
      title: newWedding.title,
      coupleNames: newWedding.coupleNames,
      date: new Date(newWedding.date),
      location: newWedding.location,
      status: 'planning' as const,
      guestCount: newWedding.guestCount
    };
    
    setWeddings([...weddings, weddingToAdd]);
    setNewWedding({
      title: '',
      coupleNames: '',
      date: '',
      location: '',
      guestCount: 0
    });
    setShowAddForm(false);
  };

  return (
    <WeddingLayout>
      <Header 
        title="Dashboard" 
        subtitle="Welcome back! Here's what's happening with your weddings."
      >
        <Button onClick={() => setShowAddForm(true)}>New Wedding</Button>
      </Header>

      {/* Add Wedding Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Add New Wedding</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Wedding Title</label>
                <Input
                  value={newWedding.title}
                  onChange={(e) => setNewWedding({...newWedding, title: e.target.value})}
                  placeholder="e.g. Sarah & John's Wedding"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Couple Names</label>
                <Input
                  value={newWedding.coupleNames}
                  onChange={(e) => setNewWedding({...newWedding, coupleNames: e.target.value})}
                  placeholder="e.g. Sarah Johnson & John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Wedding Date</label>
                <Input
                  type="date"
                  value={newWedding.date}
                  onChange={(e) => setNewWedding({...newWedding, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  value={newWedding.location}
                  onChange={(e) => setNewWedding({...newWedding, location: e.target.value})}
                  placeholder="Wedding venue"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Guest Count</label>
                <Input
                  type="number"
                  value={newWedding.guestCount || ''}
                  onChange={(e) => setNewWedding({...newWedding, guestCount: parseInt(e.target.value) || 0})}
                  placeholder="Number of guests"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddWedding}
              >
                Add Wedding
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Weddings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWeddings}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Weddings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Weddings
              <Badge variant="outline">{weddings.length} weddings</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weddings.map(wedding => (
                <WeddingCard 
                  key={wedding.id}
                  title={wedding.title}
                  coupleNames={wedding.coupleNames}
                  date={wedding.date}
                  location={wedding.location}
                  status={wedding.status}
                  guestCount={wedding.guestCount}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <TaskList 
          title="Upcoming Tasks" 
          tasks={mockTasks} 
        />
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border-b last:border-b-0">
              <div className="bg-blue-100 p-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">New task completed</p>
                <p className="text-sm text-muted-foreground">Sarah completed 'Confirm Venue' task</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 border-b last:border-b-0">
              <div className="bg-green-100 p-2 rounded-full">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Event date approaching</p>
                <p className="text-sm text-muted-foreground">"Emma & Michael's Wedding" in 2 weeks</p>
                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">Payment received</p>
                <p className="text-sm text-muted-foreground">Received $5,000 from David Wilson</p>
                <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </WeddingLayout>
  );
};

export default OrganizerDashboard;