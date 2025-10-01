'use client';

import { useState } from 'react';
import WeddingLayout from '@/components/ui/wedding-layout';
import Header from '@/components/ui/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard,
  DollarSign,
  Download,
  Plus,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

// Mock data for payments
const mockPayments = [
  {
    id: '1',
    invoiceId: 'INV-001',
    clientId: '1',
    clientName: 'Sarah Johnson',
    amount: 5000,
    currency: 'USD',
    status: 'paid' as const,
    dueDate: new Date(2024, 10, 15),
    paidDate: new Date(2024, 10, 10),
    description: 'Venue booking deposit'
  },
  {
    id: '2',
    invoiceId: 'INV-002',
    clientId: '1',
    clientName: 'Sarah Johnson',
    amount: 8000,
    currency: 'USD',
    status: 'paid' as const,
    dueDate: new Date(2024, 10, 20),
    paidDate: new Date(2024, 10, 18),
    description: 'Catering payment'
  },
  {
    id: '3',
    invoiceId: 'INV-003',
    clientId: '2',
    clientName: 'Emma Wilson',
    amount: 3000,
    currency: 'USD',
    status: 'pending' as const,
    dueDate: new Date(2024, 11, 1),
    paidDate: null,
    description: 'Photography deposit'
  },
  {
    id: '4',
    invoiceId: 'INV-004',
    clientId: '3',
    clientName: 'Lisa Chen',
    amount: 12000,
    currency: 'USD',
    status: 'overdue' as const,
    dueDate: new Date(2024, 10, 5),
    paidDate: null,
    description: 'Full wedding package'
  },
  {
    id: '5',
    invoiceId: 'INV-005',
    clientId: '1',
    clientName: 'Sarah Johnson',
    amount: 2500,
    currency: 'USD',
    status: 'paid' as const,
    dueDate: new Date(2024, 10, 25),
    paidDate: new Date(2024, 10, 22),
    description: 'Florist payment'
  }
];

const PaymentIntegration = () => {
  const [payments, setPayments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const totalPending = filteredPayments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalPaid = filteredPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  // Get status colors and icons
  const getStatusInfo = (status: 'paid' | 'pending' | 'overdue') => {
    switch (status) {
      case 'paid':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> };
      case 'overdue':
        return { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <Clock className="h-4 w-4" /> };
    }
  };

  return (
    <WeddingLayout>
      <Header 
        title="Payment Integration" 
        subtitle="Manage invoices and payments for your weddings"
      >
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </Header>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select 
              className="border rounded px-3 py-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Amount Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">Received</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(payments.reduce((sum, p) => sum + p.amount, 0) / payments.length).toLocaleString('en-US')}
            </div>
            <p className="text-xs text-muted-foreground">Per client</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Invoices & Payments
            </div>
            <Badge variant="outline">{filteredPayments.length} records</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Invoice ID</th>
                  <th className="text-left py-3 px-4">Client</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Due Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const statusInfo = getStatusInfo(payment.status);
                  return (
                    <tr key={payment.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{payment.invoiceId}</td>
                      <td className="py-3 px-4">{payment.clientName}</td>
                      <td className="py-3 px-4">{payment.description}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                          {payment.amount.toLocaleString('en-US')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {format(payment.dueDate, 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3 px-4">
                        <div className={`flex items-center ${statusInfo.color} rounded-full px-3 py-1 w-fit text-xs`}>
                          {statusInfo.icon}
                          <span className="ml-1 capitalize">{payment.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Send Reminder
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateway Integration */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Gateway Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="bg-gray-100 p-3 rounded-full mb-2">
                <CreditCard className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="font-medium">Stripe</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">Integrated</p>
              <Badge className="mt-2">Active</Badge>
            </div>
            
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="bg-gray-100 p-3 rounded-full mb-2">
                <CreditCard className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="font-medium">PayPal</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">Not connected</p>
              <Button variant="outline" size="sm" className="mt-2">Connect</Button>
            </div>
            
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="bg-gray-100 p-3 rounded-full mb-2">
                <CreditCard className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="font-medium">Midtrans</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">Not connected</p>
              <Button variant="outline" size="sm" className="mt-2">Connect</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </WeddingLayout>
  );
};

export default PaymentIntegration;