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
  Users,
  Utensils,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

// Mock data for guests
const mockGuests = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    group: 'Bride\'s Family',
    rsvpStatus: 'attending' as const,
    dietaryRestrictions: 'Vegetarian'
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    phone: '+1 (555) 234-5678',
    group: 'Groom\'s Family',
    rsvpStatus: 'attending' as const,
    dietaryRestrictions: 'None'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+1 (555) 345-6789',
    group: 'Bride\'s Work',
    rsvpStatus: 'declined' as const,
    dietaryRestrictions: 'None'
  },
  {
    id: '4',
    name: 'Sarah Davis',
    email: 'sarah@example.com',
    phone: '+1 (555) 456-7890',
    group: 'Groom\'s Friends',
    rsvpStatus: 'pending' as const,
    dietaryRestrictions: 'Gluten-free'
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert@example.com',
    phone: '+1 (555) 567-8901',
    group: 'Bride\'s Family',
    rsvpStatus: 'attending' as const,
    dietaryRestrictions: 'None'
  },
  {
    id: '6',
    name: 'Jennifer Taylor',
    email: 'jennifer@example.com',
    phone: '+1 (555) 678-9012',
    group: 'Common Friends',
    rsvpStatus: 'attending' as const,
    dietaryRestrictions: 'Vegan'
  }
];

const GuestListManagement = () => {
  const [guests, setGuests] = useState(mockGuests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.group.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = filterGroup === 'all' || guest.group === filterGroup;
    const matchesStatus = filterStatus === 'all' || guest.rsvpStatus === filterStatus;
    
    return matchesSearch && matchesGroup && matchesStatus;
  });

  // Get unique groups for filter
  const uniqueGroups = ['all', ...new Set(guests.map(guest => guest.group))];

  const statusColors = {
    pending: 'bg-yellow-500',
    attending: 'bg-green-500',
    declined: 'bg-red-500',
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    attending: <CheckCircle className="h-4 w-4" />,
    declined: <XCircle className="h-4 w-4" />
  };

  return (
    <WeddingLayout>
      <Header 
        title="Guest List Management" 
        subtitle="Manage and track your wedding guests and their RSVPs"
      >
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Guest
        </Button>
      </Header>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select 
              className="border rounded px-3 py-2"
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
            >
              {uniqueGroups.map(group => (
                <option key={group} value={group}>
                  {group === 'all' ? 'All Groups' : group}
                </option>
              ))}
            </select>
            <select 
              className="border rounded px-3 py-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="attending">Attending</option>
              <option value="declined">Declined</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Guest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guests.length}</div>
            <p className="text-xs text-muted-foreground">Invited guests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guests.filter(g => g.rsvpStatus === 'attending').length}
            </div>
            <p className="text-xs text-muted-foreground">Confirmed attendance</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Not Attending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guests.filter(g => g.rsvpStatus === 'declined').length}
            </div>
            <p className="text-xs text-muted-foreground">Declined invites</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending RSVPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guests.filter(g => g.rsvpStatus === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Waiting for response</p>
          </CardContent>
        </Card>
      </div>

      {/* Guest List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Guest List
            <Badge variant="outline">{filteredGuests.length} guests</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Guest</th>
                  <th className="text-left py-3 px-4">Group</th>
                  <th className="text-left py-3 px-4">RSVP Status</th>
                  <th className="text-left py-3 px-4">Dietary Restrictions</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{guest.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{guest.group}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className={`h-3 w-3 rounded-full mr-2 ${statusColors[guest.rsvpStatus]}`}></span>
                        {statusIcons[guest.rsvpStatus]}
                        <span className="ml-2 capitalize">{guest.rsvpStatus}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {guest.dietaryRestrictions !== 'None' ? (
                        <div className="flex items-center">
                          <Utensils className="h-4 w-4 mr-2 text-muted-foreground" />
                          {guest.dietaryRestrictions}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-muted-foreground flex flex-col">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {guest.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {guest.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Users className="h-4 w-4" />
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

export default GuestListManagement;