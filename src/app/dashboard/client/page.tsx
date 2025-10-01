'use client';

import { useState, useEffect } from 'react';
import WeddingLayout from '@/components/ui/wedding-layout';
import Header from '@/components/ui/header';
import TaskList from '@/components/tasks/task-list';
import BudgetItem from '@/components/budget/budget-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, DollarSign, Timer, CheckCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

// Mock data for the client dashboard
const mockWedding = {
  id: '1',
  title: "Sarah & John's Wedding",
  coupleNames: "Sarah Johnson & John Smith",
  date: new Date(2025, 5, 15),
  location: "Beach Resort, Maldives",
  status: 'confirmed' as const,
  guestCount: 120,
  totalBudget: 85000,
  spentBudget: 62000
};

const mockTasks = [
  {
    id: '1',
    title: 'Book Catering Service',
    description: 'Finalize menu and catering contract',
    dueDate: new Date(2025, 3, 15),
    assignee: 'You',
    status: 'in_progress' as const
  },
  {
    id: '2',
    title: 'Order Wedding Invitations',
    description: 'Select design and place order with printer',
    dueDate: new Date(2025, 2, 20),
    assignee: 'You',
    status: 'todo' as const
  },
  {
    id: '3',
    title: 'Try Wedding Dress',
    description: 'First fitting appointment',
    dueDate: new Date(2025, 3, 5),
    assignee: 'You',
    status: 'todo' as const
  }
];

const mockBudgetItems = [
  {
    name: 'Venue',
    category: 'Location',
    estimated: 15000,
    actual: 15500,
    paid: 15500,
    status: 'paid' as const
  },
  {
    name: 'Catering',
    category: 'Food & Beverage',
    estimated: 25000,
    actual: 28000,
    paid: 18000,
    status: 'partial' as const
  },
  {
    name: 'Photography',
    category: 'Entertainment',
    estimated: 8000,
    actual: 8000,
    paid: 8000,
    status: 'paid' as const
  },
  {
    name: 'Florist',
    category: 'Decor',
    estimated: 5000,
    actual: 4500,
    paid: 2000,
    status: 'partial' as const
  }
];

const ClientDashboard = () => {
  const [daysToWedding, setDaysToWedding] = useState(0);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Calculate days to wedding
    const days = differenceInDays(mockWedding.date, new Date());
    setDaysToWedding(days > 0 ? days : 0);
    
    // Calculate budget progress
    const progress = mockWedding.totalBudget > 0 
      ? (mockWedding.spentBudget / mockWedding.totalBudget) * 100 
      : 0;
    setProgress(progress);
  }, []);

  return (
    <WeddingLayout>
      <Header 
        title={mockWedding.title} 
        subtitle="Your wedding planning dashboard"
      >
        <Button variant="outline">View Calendar</Button>
      </Header>

      {/* Wedding Countdown */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{mockWedding.title}</h2>
                <p className="mt-1 opacity-90">
                  {format(mockWedding.date, 'PPP')} • {mockWedding.location}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end">
                  <Timer className="h-5 w-5 mr-2" />
                  <span className="text-3xl font-bold">{daysToWedding}</span>
                  <span className="ml-2">days to go!</span>
                </div>
                <p className="mt-1 opacity-90">Get ready for your special day</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockWedding.guestCount}</div>
            <p className="text-xs text-muted-foreground">Invited</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Planned Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockWedding.totalBudget.toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">Total budget</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Spent So Far</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockWedding.spentBudget.toLocaleString('en-US')}</div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {progress.toFixed(1)}% of budget used
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks and Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Tasks */}
        <TaskList 
          title="Your Tasks" 
          tasks={mockTasks} 
        />

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Budget Overview
              <Badge variant="outline">{mockBudgetItems.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockBudgetItems.map((item, index) => (
              <BudgetItem key={index} {...item} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border-b last:border-b-0">
              <div className="bg-blue-100 p-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Caterer confirmed menu</p>
                <p className="text-sm text-muted-foreground">Your wedding planner has confirmed the catering menu</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 border-b last:border-b-0">
              <div className="bg-green-100 p-2 rounded-full">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Payment received</p>
                <p className="text-sm text-muted-foreground">Catering payment of $8,000 confirmed</p>
                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">Venue walk-through</p>
                <p className="text-sm text-muted-foreground">Scheduled for next Friday at 3 PM</p>
                <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </WeddingLayout>
  );
};

export default ClientDashboard;