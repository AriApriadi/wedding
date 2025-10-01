'use client';

import { useState } from 'react';
import WeddingLayout from '@/components/ui/wedding-layout';
import Header from '@/components/ui/header';
import VendorCard from '@/components/vendors/vendor-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Building,
  Star
} from 'lucide-react';

// Mock data for vendors
const mockVendors = [
  {
    id: '1',
    name: 'Elegant Catering Co.',
    category: 'Catering',
    contactPerson: 'Michael Johnson',
    email: 'michael@elegantcatering.com',
    phone: '+1 (555) 123-4567',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Bloom & Blossom Florist',
    category: 'Florist',
    contactPerson: 'Sarah Davis',
    email: 'sarah@bloomflorist.com',
    phone: '+1 (555) 234-5678',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Capture Moments Photography',
    category: 'Photography',
    contactPerson: 'David Wilson',
    email: 'david@capturemoments.com',
    phone: '+1 (555) 345-6789',
    rating: 5.0
  },
  {
    id: '4',
    name: 'Harmony DJ Services',
    category: 'Entertainment',
    contactPerson: 'James Brown',
    email: 'james@harmonydjs.com',
    phone: '+1 (555) 456-7890',
    rating: 4.7
  },
  {
    id: '5',
    name: 'The Perfect Venue',
    category: 'Venue',
    contactPerson: 'Lisa Thompson',
    email: 'lisa@perfectvenue.com',
    phone: '+1 (555) 567-8901',
    rating: 4.6
  },
  {
    id: '6',
    name: 'Sweet Dreams Cakes',
    category: 'Bakery',
    contactPerson: 'Emma Garcia',
    email: 'emma@sweetdreamscakes.com',
    phone: '+1 (555) 678-9012',
    rating: 4.9
  }
];

const VendorManagement = () => {
  const [vendors, setVendors] = useState(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || vendor.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const uniqueCategories = ['all', ...new Set(vendors.map(vendor => vendor.category))];

  return (
    <WeddingLayout>
      <Header 
        title="Vendor Management" 
        subtitle="Manage your vendor database and partnerships"
      >
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </Header>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="border rounded px-3 py-2"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {uniqueCategories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <Button variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Sort by Rating
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">In your database</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(vendors.reduce((sum, vendor) => sum + vendor.rating, 0) / vendors.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Overall rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendors.length > 0 
                ? Object.entries(
                    vendors.reduce((acc, vendor) => {
                      acc[vendor.category] = (acc[vendor.category] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Most represented</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Highly Rated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendors.filter(v => v.rating >= 4.5).length}
            </div>
            <p className="text-xs text-muted-foreground">4.5 stars & above</p>
          </CardContent>
        </Card>
      </div>

      {/* Vendor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map(vendor => (
          <VendorCard key={vendor.id} {...vendor} />
        ))}
      </div>
    </WeddingLayout>
  );
};

export default VendorManagement;