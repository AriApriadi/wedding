'use client';

import { useState } from 'react';
import WeddingLayout from '@/components/ui/wedding-layout';
import Header from '@/components/ui/header';
import BudgetItem from '@/components/budget/budget-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart
} from 'lucide-react';
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Pie,
  Cell
} from 'recharts';

// Mock data for budget items
const mockBudgetItems = [
  {
    id: '1',
    name: 'Venue',
    category: 'Location',
    estimated: 15000,
    actual: 15500,
    paid: 15500,
    status: 'paid' as const
  },
  {
    id: '2',
    name: 'Catering',
    category: 'Food & Beverage',
    estimated: 25000,
    actual: 28000,
    paid: 18000,
    status: 'partial' as const
  },
  {
    id: '3',
    name: 'Photography',
    category: 'Entertainment',
    estimated: 8000,
    actual: 8000,
    paid: 8000,
    status: 'paid' as const
  },
  {
    id: '4',
    name: 'Florist',
    category: 'Decor',
    estimated: 5000,
    actual: 4500,
    paid: 2000,
    status: 'partial' as const
  },
  {
    id: '5',
    name: 'Wedding Dress',
    category: 'Attire',
    estimated: 3000,
    actual: 3200,
    paid: 3200,
    status: 'paid' as const
  },
  {
    id: '6',
    name: 'Entertainment',
    category: 'Entertainment',
    estimated: 6000,
    actual: 5500,
    paid: 0,
    status: 'unpaid' as const
  }
];

// Data for the charts
const budgetCategoryData = [
  { name: 'Venue', value: 15500 },
  { name: 'Catering', value: 28000 },
  { name: 'Photography', value: 8000 },
  { name: 'Florist', value: 4500 },
  { name: 'Dress', value: 3200 },
  { name: 'Entertainment', value: 5500 },
];

const budgetTrendData = [
  { month: 'Jan', estimated: 45000, actual: 42000 },
  { month: 'Feb', estimated: 50000, actual: 48000 },
  { month: 'Mar', estimated: 55000, actual: 53000 },
  { month: 'Apr', estimated: 60000, actual: 57000 },
  { month: 'May', estimated: 65000, actual: 62000 },
  { month: 'Jun', estimated: 70000, actual: 65000 },
];

const BudgetTool = () => {
  const [budgetItems, setBudgetItems] = useState(mockBudgetItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalEstimated, setTotalEstimated] = useState(0);
  const [totalActual, setTotalActual] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  // Calculate totals
  useState(() => {
    const estimated = budgetItems.reduce((sum, item) => sum + item.estimated, 0);
    const actual = budgetItems.reduce((sum, item) => sum + item.actual, 0);
    const paid = budgetItems.reduce((sum, item) => sum + item.paid, 0);
    
    setTotalEstimated(estimated);
    setTotalActual(actual);
    setTotalPaid(paid);
  });

  const filteredItems = budgetItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <WeddingLayout>
      <Header 
        title="Budgeting Tool" 
        subtitle="Track and manage all expenses for your weddings"
      >
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Budget Item
        </Button>
      </Header>

      {/* Budget Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estimated Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEstimated.toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">Total planned expenses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actual Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalActual.toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">Total actual expenses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">Amount already paid</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalActual - totalPaid).toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">Amount still to pay</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Budget by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <Pie
                  data={budgetCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {budgetCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Budget Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={budgetTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="estimated" fill="#8884d8" name="Estimated" />
                  <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search budget items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">All Categories</Button>
            <Button variant="outline">All Status</Button>
          </div>
        </CardContent>
      </Card>

      {/* Budget Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Budget Items
            <Badge variant="outline">{filteredItems.length} items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.map((item, index) => (
            <BudgetItem key={index} {...item} />
          ))}
        </CardContent>
      </Card>
    </WeddingLayout>
  );
};

export default BudgetTool;