'use client';

import { useState } from 'react';
import WeddingLayout from '@/components/ui/wedding-layout';
import Header from '@/components/ui/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Users,
  Table,
  RotateCcw,
  Save,
  Download
} from 'lucide-react';

// Mock data for guests
const mockGuests = [
  { id: 1, name: 'John Smith', guestGroup: 'Bride\'s Family', dietaryRestrictions: 'None' },
  { id: 2, name: 'Emily Johnson', guestGroup: 'Groom\'s Family', dietaryRestrictions: 'None' },
  { id: 3, name: 'Michael Brown', guestGroup: 'Bride\'s Work', dietaryRestrictions: 'None' },
  { id: 4, name: 'Sarah Davis', guestGroup: 'Groom\'s Friends', dietaryRestrictions: 'Gluten-free' },
  { id: 5, name: 'Robert Wilson', guestGroup: 'Bride\'s Family', dietaryRestrictions: 'None' },
  { id: 6, name: 'Jennifer Taylor', guestGroup: 'Common Friends', dietaryRestrictions: 'Vegan' },
  { id: 7, name: 'David Anderson', guestGroup: 'Groom\'s Family', dietaryRestrictions: 'None' },
  { id: 8, name: 'Lisa Martinez', guestGroup: 'Bride\'s Friends', dietaryRestrictions: 'None' },
  { id: 9, name: 'James Thomas', guestGroup: 'Groom\'s Work', dietaryRestrictions: 'None' },
  { id: 10, name: 'Patricia Jackson', guestGroup: 'Bride\'s Family', dietaryRestrictions: 'Vegetarian' },
];

// Mock data for tables
const mockTables = [
  { id: 1, name: 'Table 1', capacity: 8, guests: [1, 2, 3, 4] },
  { id: 2, name: 'Table 2', capacity: 8, guests: [5, 6] },
  { id: 3, name: 'Table 3', capacity: 8, guests: [7, 8, 9] },
  { id: 4, name: 'Table 4', capacity: 8, guests: [10] },
];

const SeatingChartTool = () => {
  const [tables, setTables] = useState(mockTables);
  const [guests, setGuests] = useState(mockGuests);
  const [selectedGuest, setSelectedGuest] = useState<number | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  // Get guest by ID
  const getGuestById = (id: number) => {
    return guests.find(g => g.id === id);
  };

  // Get table by ID
  const getTableById = (id: number) => {
    return tables.find(t => t.id === id);
  };

  // Assign guest to table
  const assignGuestToTable = (guestId: number, tableId: number) => {
    setTables(tables.map(table => {
      if (table.id === tableId && table.capacity > table.guests.length) {
        // Remove guest from any existing table
        const updatedTables = tables.map(t => ({
          ...t,
          guests: t.guests.filter(gid => gid !== guestId)
        }));
        
        // Add guest to selected table
        return {
          ...table,
          guests: [...table.guests, guestId]
        };
      }
      return table;
    }));
  };

  // Remove guest from table
  const removeGuestFromTable = (guestId: number, tableId: number) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          guests: table.guests.filter(gid => gid !== guestId)
        };
      }
      return table;
    }));
  };

  // Calculate capacity usage
  const getTableCapacityUsage = (tableId: number) => {
    const table = getTableById(tableId);
    if (!table) return { used: 0, total: 0 };
    return { used: table.guests.length, total: table.capacity };
  };

  return (
    <WeddingLayout>
      <Header 
        title="Seating Chart Tool" 
        subtitle="Design and manage your wedding seating arrangements"
      >
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </Header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guest List Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Guest List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {guests.map(guest => {
                // Check if guest is already seated
                const isSeated = tables.some(table => table.guests.includes(guest.id));
                
                return (
                  <div 
                    key={guest.id} 
                    className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center ${
                      selectedGuest === guest.id 
                        ? 'bg-blue-100 border-blue-500' 
                        : isSeated 
                          ? 'bg-gray-100 border-gray-300' 
                          : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedGuest(guest.id)}
                  >
                    <div>
                      <div className="font-medium">{guest.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {guest.guestGroup}
                        {guest.dietaryRestrictions !== 'None' && ` • ${guest.dietaryRestrictions}`}
                      </div>
                    </div>
                    <Badge variant={isSeated ? 'default' : 'secondary'}>
                      {isSeated ? 'Seated' : 'Unassigned'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Seating Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Table className="h-5 w-5 mr-2" />
                Seating Area
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Table
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-8 justify-center items-start">
              {tables.map(table => {
                const { used, total } = getTableCapacityUsage(table.id);
                return (
                  <div 
                    key={table.id}
                    className={`border-2 rounded-lg p-4 w-64 ${
                      selectedTable === table.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedTable(table.id)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold">Table {table.name}</h3>
                      <Badge variant="outline">
                        {used}/{total} seats
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {table.guests.map(guestId => {
                        const guest = getGuestById(guestId);
                        if (!guest) return null;
                        
                        return (
                          <div 
                            key={guestId}
                            className="flex justify-between items-center p-2 bg-white rounded border"
                          >
                            <div>
                              <div className="font-medium">{guest.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {guest.guestGroup}
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeGuestFromTable(guestId, table.id);
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        );
                      })}
                      
                      {Array.from({ length: total - used }).map((_, index) => (
                        <div 
                          key={index} 
                          className="p-2 border-2 border-dashed rounded text-center text-gray-400 text-sm"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const guestId = parseInt(e.dataTransfer.getData('guestId'));
                            if (guestId) {
                              assignGuestToTable(guestId, table.id);
                            }
                          }}
                        >
                          Empty Seat
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seating Chart Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
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
            <CardTitle className="text-sm font-medium">Seated Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tables.reduce((sum, table) => sum + table.guests.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Assigned seats</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tables.reduce((sum, table) => sum + (table.capacity - table.guests.length), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Open spots</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tables.length}</div>
            <p className="text-xs text-muted-foreground">Total tables</p>
          </CardContent>
        </Card>
      </div>
    </WeddingLayout>
  );
};

export default SeatingChartTool;