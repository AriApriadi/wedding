'use client';

import { useState } from 'react';
import WeddingLayout from '@/components/ui/wedding-layout';
import Header from '@/components/ui/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Users,
  MoreHorizontal,
  X
} from 'lucide-react';

// Mock data for clients
const mockClients = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    weddingDate: new Date(2025, 5, 15),
    location: 'Beach Resort, Maldives',
    guestCount: 120,
    status: 'confirmed',
    lastContact: new Date(2024, 11, 10)
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    phone: '+1 (555) 987-6543',
    weddingDate: new Date(2025, 7, 22),
    location: 'Garden Venue, California',
    guestCount: 85,
    status: 'planning',
    lastContact: new Date(2024, 11, 5)
  },
  {
    id: '3',
    name: 'Lisa Chen',
    email: 'lisa@example.com',
    phone: '+1 (555) 456-7890',
    weddingDate: new Date(2024, 11, 10),
    location: 'Historic Castle, Italy',
    guestCount: 200,
    status: 'completed',
    lastContact: new Date(2024, 10, 28)
  }
];

const ClientManagement = () => {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    location: '',
    guestCount: 0,
    status: 'planning' as const,
    lastContact: new Date().toISOString().split('T')[0]
  });

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) return;
    
    const clientToAdd = {
      id: (clients.length + 1).toString(),
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      weddingDate: new Date(newClient.weddingDate),
      location: newClient.location,
      guestCount: newClient.guestCount,
      status: newClient.status,
      lastContact: new Date(newClient.lastContact)
    };
    
    setClients([...clients, clientToAdd]);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      weddingDate: '',
      location: '',
      guestCount: 0,
      status: 'planning',
      lastContact: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  return (
    <WeddingLayout>
      <Header 
        title="Client Management" 
        subtitle="Manage all your clients and their wedding information"
      >
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </Header>

      {/* Add Client Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Add New Client</CardTitle>
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
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  placeholder="Enter client's name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Wedding Date</label>
                <Input
                  type="date"
                  value={newClient.weddingDate}
                  onChange={(e) => setNewClient({...newClient, weddingDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  value={newClient.location}
                  onChange={(e) => setNewClient({...newClient, location: e.target.value})}
                  placeholder="Wedding location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Guest Count</label>
                <Input
                  type="number"
                  value={newClient.guestCount || ''}
                  onChange={(e) => setNewClient({...newClient, guestCount: parseInt(e.target.value) || 0})}
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
                onClick={handleAddClient}
              >
                Add Client
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">All Status</Button>
            <Button variant="outline">All Dates</Button>
          </div>
        </CardContent>
      </Card>

      {/* Client Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.filter(c => c.status !== 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently planning</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.filter(c => 
                c.weddingDate.getMonth() === new Date().getMonth() &&
                c.weddingDate.getFullYear() === new Date().getFullYear()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Weddings this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125,000</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Your Clients
            <Badge variant="outline">{filteredClients.length} clients</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Client</th>
                  <th className="text-left py-3 px-4">Wedding Date</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Guests</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Last Contact</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {client.email}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {client.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {client.weddingDate.toLocaleDateString('en-US')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {client.location}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        {client.guestCount}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={client.status === 'confirmed' ? 'default' : 
                                client.status === 'planning' ? 'secondary' : 'outline'}
                      >
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {client.lastContact.toLocaleDateString('en-US')}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </WeddingLayout>
  );
};

export default ClientManagement;