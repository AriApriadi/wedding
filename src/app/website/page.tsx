'use client';

import { useState } from 'react';
import WeddingLayout from '@/components/ui/wedding-layout';
import Header from '@/components/ui/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  LayoutTemplate,
  Palette,
  Download,
  Eye,
  Settings,
  Image,
  Calendar as CalendarIcon,
  MapPin,
  Heart,
  Users
} from 'lucide-react';

// Mock data for website templates
const mockTemplates = [
  { id: 1, name: 'Classic Elegance', category: 'Elegant', thumbnail: '/placeholder-template-1.jpg' },
  { id: 2, name: 'Modern Minimal', category: 'Modern', thumbnail: '/placeholder-template-2.jpg' },
  { id: 3, name: 'Rustic Charm', category: 'Rustic', thumbnail: '/placeholder-template-3.jpg' },
  { id: 4, name: 'Beach Breeze', category: 'Beach', thumbnail: '/placeholder-template-4.jpg' },
  { id: 5, name: 'Garden Party', category: 'Garden', thumbnail: '/placeholder-template-5.jpg' },
  { id: 6, name: 'Vintage Romance', category: 'Vintage', thumbnail: '/placeholder-template-6.jpg' },
];

// Mock data for website sections
const mockSections = [
  { id: 'hero', name: 'Hero Section', enabled: true },
  { id: 'couple', name: 'Couple Story', enabled: true },
  { id: 'event-details', name: 'Event Details', enabled: true },
  { id: 'rsvp', name: 'RSVP Form', enabled: true },
  { id: 'gallery', name: 'Photo Gallery', enabled: false },
  { id: 'registry', name: 'Gift Registry', enabled: false },
];

const WeddingWebsiteBuilder = () => {
  const [templates] = useState(mockTemplates);
  const [sections, setSections] = useState(mockSections);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [websiteTitle, setWebsiteTitle] = useState("John & Sarah's Wedding");
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'publish'>('design');

  // Toggle section visibility
  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, enabled: !section.enabled } 
        : section
    ));
  };

  return (
    <WeddingLayout>
      <Header 
        title="Wedding Website Builder" 
        subtitle="Create your personalized wedding website"
      >
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </Header>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <Button 
          variant={activeTab === 'design' ? 'default' : 'ghost'} 
          className="rounded-b-none"
          onClick={() => setActiveTab('design')}
        >
          <LayoutTemplate className="h-4 w-4 mr-2" />
          Design
        </Button>
        <Button 
          variant={activeTab === 'content' ? 'default' : 'ghost'} 
          className="rounded-b-none"
          onClick={() => setActiveTab('content')}
        >
          <Settings className="h-4 w-4 mr-2" />
          Content
        </Button>
        <Button 
          variant={activeTab === 'publish' ? 'default' : 'ghost'} 
          className="rounded-b-none"
          onClick={() => setActiveTab('publish')}
        >
          <Download className="h-4 w-4 mr-2" />
          Publish
        </Button>
      </div>

      {activeTab === 'design' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LayoutTemplate className="h-5 w-5 mr-2" />
                Choose a Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map(template => (
                  <div 
                    key={template.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer ${
                      selectedTemplate === template.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="h-32 bg-gray-200 rounded mb-2 flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.category}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Website Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden h-96 bg-white">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-40 flex items-center justify-center">
                  <h2 className="text-2xl font-bold text-white">{websiteTitle}</h2>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-pink-500" />
                    <span className="mx-2 text-gray-500">June 15, 2025</span>
                    <Heart className="h-6 w-6 text-pink-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Ceremony: 4:00 PM</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Beach Resort, Maldives</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Reception to follow</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Editor */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Content Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Website Title</label>
                  <Input 
                    value={websiteTitle} 
                    onChange={(e) => setWebsiteTitle(e.target.value)} 
                    placeholder="Enter website title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Couple's Story</label>
                  <textarea 
                    className="w-full p-2 border rounded min-h-[100px]"
                    placeholder="Tell your love story..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Event Details</label>
                  <textarea 
                    className="w-full p-2 border rounded min-h-[100px]"
                    placeholder="Provide event details..."
                  ></textarea>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LayoutTemplate className="h-5 w-5 mr-2" />
                Page Sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sections.map(section => (
                  <div 
                    key={section.id} 
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <h4 className="font-medium">{section.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {section.enabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <Button
                      variant={section.enabled ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => toggleSection(section.id)}
                    >
                      {section.enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'publish' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Publish Options */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Publish Your Website
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Website URL</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      https://
                    </span>
                    <Input 
                      className="rounded-l-none"
                      value="johnandsarah-wedding.com" 
                      placeholder="your-wedding-name"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Publish Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">Public Access</h4>
                        <p className="text-sm text-muted-foreground">Allow anyone with the link to view</p>
                      </div>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">RSVP Form</h4>
                        <p className="text-sm text-muted-foreground">Collect responses from guests</p>
                      </div>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">Photo Gallery</h4>
                        <p className="text-sm text-muted-foreground">Share your moments</p>
                      </div>
                      <Badge variant="outline">Disabled</Badge>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  Publish Website
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Website Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Website Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Visitors</div>
                </div>
                
                <div className="p-4 border rounded">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">RSVP Responses</div>
                </div>
                
                <div className="p-4 border rounded">
                  <div className="text-2xl font-bold">johnandsarah.com</div>
                  <div className="text-sm text-muted-foreground">Current URL</div>
                </div>
                
                <div className="p-4 border rounded">
                  <div className="text-2xl font-bold">Jun 15, 2025</div>
                  <div className="text-sm text-muted-foreground">Event Date</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </WeddingLayout>
  );
};

export default WeddingWebsiteBuilder;