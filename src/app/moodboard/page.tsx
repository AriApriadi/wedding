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
  Image,
  Palette,
  Upload,
  Heart,
  Filter,
  MoreHorizontal
} from 'lucide-react';

// Mock data for mood board images
const mockImages = [
  {
    id: '1',
    title: 'Color Palette',
    caption: 'Soft pastel color palette for the wedding',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    category: 'Colors',
    uploadDate: new Date(2024, 10, 15),
    likes: 12
  },
  {
    id: '2',
    title: 'Venue Decor',
    caption: 'Outdoor ceremony setup with floral arrangements',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    category: 'Decor',
    uploadDate: new Date(2024, 10, 18),
    likes: 24
  },
  {
    id: '3',
    title: 'Bridal Bouquet',
    caption: 'Rustic wildflower bouquet design',
    imageUrl: 'https://images.unsplash.com/photo-1513488738209-075d3efe43d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    category: 'Flowers',
    uploadDate: new Date(2024, 10, 20),
    likes: 18
  },
  {
    id: '4',
    title: 'Table Settings',
    caption: 'Elegant dinner table setup',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    category: 'Tableware',
    uploadDate: new Date(2024, 10, 22),
    likes: 15
  },
  {
    id: '5',
    title: 'Cake Design',
    caption: 'Three-tier wedding cake with flowers',
    imageUrl: 'https://images.unsplash.com/photo-1559282944-18ea9aea36c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    category: 'Cake',
    uploadDate: new Date(2024, 10, 25),
    likes: 30
  },
  {
    id: '6',
    title: 'Lighting Setup',
    caption: 'Ambient lighting for evening reception',
    imageUrl: 'https://images.unsplash.com/photo-1514582061085-6acb58b6d7c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    category: 'Lighting',
    uploadDate: new Date(2024, 10, 28),
    likes: 22
  }
];

const InspirationBoard = () => {
  const [images, setImages] = useState(mockImages);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newCaption, setNewCaption] = useState('');

  const filteredImages = images.filter(img => {
    const matchesSearch = 
      img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.caption.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || img.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const uniqueCategories = ['all', ...new Set(images.map(img => img.category))];

  // Toggle like for an image
  const toggleLike = (id: string) => {
    setImages(images.map(img => 
      img.id === id 
        ? { ...img, likes: img.likes + (img.id === selectedImage ? -1 : 1) } 
        : img
    ));
    setSelectedImage(selectedImage === id ? null : id);
  };

  return (
    <WeddingLayout>
      <Header 
        title="Inspiration Board" 
        subtitle="Create and share your wedding mood board"
      >
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
      </Header>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inspiration..."
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
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mood Board Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{images.length}</div>
            <p className="text-xs text-muted-foreground">In your board</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {images.reduce((sum, img) => sum + img.likes, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all images</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCategories.length - 1}</div>
            <p className="text-xs text-muted-foreground">Different themes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uniqueCategories.length > 1 ? uniqueCategories[1] : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Most represented</p>
          </CardContent>
        </Card>
      </div>

      {/* Image Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Mood Board Gallery
            </div>
            <Badge variant="outline">{filteredImages.length} items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="group relative rounded-lg overflow-hidden border">
                <div className="relative aspect-square">
                  <img 
                    src={image.imageUrl} 
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => toggleLike(image.id)}
                      className="rounded-full"
                    >
                      <Heart 
                        className={`h-4 w-4 ${selectedImage === image.id ? 'fill-red-500 text-red-500' : ''}`} 
                      />
                      <span className="ml-1">{image.likes}</span>
                    </Button>
                    <Button variant="secondary" size="sm" className="rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">{image.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {image.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {image.caption}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{image.likes} likes</span>
                    <span>{image.uploadDate.toLocaleDateString('en-US')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </WeddingLayout>
  );
};

export default InspirationBoard;