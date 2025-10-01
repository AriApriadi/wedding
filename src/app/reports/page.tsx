'use client';

import { useState } from 'react';
import WeddingLayout from '@/components/ui/wedding-layout';
import Header from '@/components/ui/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Star,
  Download
} from 'lucide-react';

// Mock data for analytics
const revenueData = [
  { month: 'Jan', revenue: 12000, expenses: 8000 },
  { month: 'Feb', revenue: 19000, expenses: 12000 },
  { month: 'Mar', revenue: 15000, expenses: 10000 },
  { month: 'Apr', revenue: 18000, expenses: 11000 },
  { month: 'May', revenue: 22000, expenses: 14000 },
  { month: 'Jun', revenue: 25000, expenses: 16000 },
  { month: 'Jul', revenue: 21000, expenses: 13000 },
  { month: 'Aug', revenue: 23000, expenses: 15000 },
  { month: 'Sep', revenue: 27000, expenses: 17000 },
  { month: 'Oct', revenue: 30000, expenses: 18000 },
  { month: 'Nov', revenue: 28000, expenses: 16000 },
  { month: 'Dec', revenue: 32000, expenses: 19000 },
];

const vendorData = [
  { name: 'Catering', value: 35 },
  { name: 'Photography', value: 20 },
  { name: 'Florist', value: 15 },
  { name: 'Venue', value: 15 },
  { name: 'Entertainment', value: 10 },
  { name: 'Other', value: 5 },
];

const clientData = [
  { month: 'Jan', newClients: 8, completedWeddings: 5 },
  { month: 'Feb', newClients: 12, completedWeddings: 7 },
  { month: 'Mar', newClients: 10, completedWeddings: 6 },
  { month: 'Apr', newClients: 15, completedWeddings: 8 },
  { month: 'May', newClients: 14, completedWeddings: 9 },
  { month: 'Jun', newClients: 18, completedWeddings: 12 },
  { month: 'Jul', newClients: 16, completedWeddings: 10 },
  { month: 'Aug', newClients: 20, completedWeddings: 14 },
  { month: 'Sep', newClients: 22, completedWeddings: 16 },
  { month: 'Oct', newClients: 25, completedWeddings: 18 },
  { month: 'Nov', newClients: 24, completedWeddings: 20 },
  { month: 'Dec', newClients: 28, completedWeddings: 22 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ReportingAnalytics = () => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('year');
  
  // Calculate summary stats
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = revenueData.reduce((sum, item) => sum + item.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalClients = clientData.reduce((sum, item) => sum + item.newClients, 0);
  const completedWeddings = clientData.reduce((sum, item) => sum + item.completedWeddings, 0);

  return (
    <WeddingLayout>
      <Header 
        title="Reporting & Analytics" 
        subtitle="Track your business performance and insights"
      >
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </Header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netProfit.toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">After expenses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weddings Completed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedWeddings}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue vs Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Vendor Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vendorData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {vendorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Client Acquisition */}
        <Card>
          <CardHeader>
            <CardTitle>Client Acquisition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={clientData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="newClients" stroke="#3b82f6" name="New Clients" />
                  <Line type="monotone" dataKey="completedWeddings" stroke="#10b981" name="Completed Weddings" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Client Satisfaction</span>
                  <span className="text-sm font-medium">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">On-Time Delivery</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Budget Adherence</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Repeat Business</span>
                  <span className="text-sm font-medium">24%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Vendors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Top Performing Vendors
            </div>
            <Badge variant="outline">This year</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Elegant Catering Co.</h3>
                  <p className="text-sm text-muted-foreground">Catering</p>
                </div>
                <Badge variant="default">4.9 ★</Badge>
              </div>
              <p className="text-sm mt-2">Worked on 24 weddings this year</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Capture Moments Photography</h3>
                  <p className="text-sm text-muted-foreground">Photography</p>
                </div>
                <Badge variant="default">5.0 ★</Badge>
              </div>
              <p className="text-sm mt-2">Worked on 18 weddings this year</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Bloom & Blossom Florist</h3>
                  <p className="text-sm text-muted-foreground">Florist</p>
                </div>
                <Badge variant="default">4.8 ★</Badge>
              </div>
              <p className="text-sm mt-2">Worked on 32 weddings this year</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </WeddingLayout>
  );
};

export default ReportingAnalytics;