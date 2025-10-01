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
  File, 
  FileText, 
  FileImage, 
  FileVideo, 
  Download,
  MoreHorizontal,
  Calendar,
  User
} from 'lucide-react';
import { format } from 'date-fns';

// Mock data for documents
const mockDocuments = [
  {
    id: '1',
    fileName: 'Wedding Contract.pdf',
    filePath: '/uploads/wedding-contract.pdf',
    fileSizeKb: 1250,
    uploadDate: new Date(2024, 10, 15),
    uploader: 'Sarah Johnson',
    category: 'Contract',
    weddingId: '1'
  },
  {
    id: '2',
    fileName: 'Venue Layout.jpg',
    filePath: '/uploads/venue-layout.jpg',
    fileSizeKb: 2500,
    uploadDate: new Date(2024, 10, 18),
    uploader: 'You',
    category: 'Design',
    weddingId: '1'
  },
  {
    id: '3',
    fileName: 'Catering Menu.docx',
    filePath: '/uploads/catering-menu.docx',
    fileSizeKb: 850,
    uploadDate: new Date(2024, 10, 20),
    uploader: 'Michael Brown',
    category: 'Food',
    weddingId: '1'
  },
  {
    id: '4',
    fileName: 'Vendor Agreement.pdf',
    filePath: '/uploads/vendor-agreement.pdf',
    fileSizeKb: 950,
    uploadDate: new Date(2024, 10, 22),
    uploader: 'You',
    category: 'Contract',
    weddingId: '2'
  },
  {
    id: '5',
    fileName: 'Photography Package.pdf',
    filePath: '/uploads/photography-package.pdf',
    fileSizeKb: 1100,
    uploadDate: new Date(2024, 10, 25),
    uploader: 'David Wilson',
    category: 'Service',
    weddingId: '1'
  },
  {
    id: '6',
    fileName: 'Floral Design.jpg',
    filePath: '/uploads/floral-design.jpg',
    fileSizeKb: 3200,
    uploadDate: new Date(2024, 10, 28),
    uploader: 'Sarah Johnson',
    category: 'Design',
    weddingId: '1'
  }
];

const DocumentManagement = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesType = filterType === 'all' || 
      (filterType === 'pdf' && doc.fileName.toLowerCase().endsWith('.pdf')) ||
      (filterType === 'image' && (doc.fileName.toLowerCase().endsWith('.jpg') || 
                                  doc.fileName.toLowerCase().endsWith('.jpeg') || 
                                  doc.fileName.toLowerCase().endsWith('.png') || 
                                  doc.fileName.toLowerCase().endsWith('.gif'))) ||
      (filterType === 'document' && (doc.fileName.toLowerCase().endsWith('.docx') || 
                                     doc.fileName.toLowerCase().endsWith('.doc') || 
                                     doc.fileName.toLowerCase().endsWith('.txt')));
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Get unique categories for filter
  const uniqueCategories = ['all', ...new Set(documents.map(doc => doc.category))];
  
  // Get file type icon
  const getFileIcon = (fileName: string) => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.endsWith('.pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || lowerName.endsWith('.png') || lowerName.endsWith('.gif')) 
      return <FileImage className="h-5 w-5 text-green-500" />;
    if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc') || lowerName.endsWith('.txt')) 
      return <File className="h-5 w-5 text-blue-500" />;
    if (lowerName.endsWith('.mp4') || lowerName.endsWith('.mov') || lowerName.endsWith('.avi')) 
      return <FileVideo className="h-5 w-5 text-purple-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  // Format file size
  const formatFileSize = (sizeKb: number) => {
    if (sizeKb < 1024) return `${sizeKb} KB`;
    return `${(sizeKb / 1024).toFixed(1)} MB`;
  };

  return (
    <WeddingLayout>
      <Header 
        title="Document Management" 
        subtitle="Store and manage all wedding-related documents"
      >
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </Header>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
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
            <select 
              className="border rounded px-3 py-2"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF Files</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">In your library</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(documents.reduce((sum, doc) => sum + doc.fileSizeKb, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Storage used</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCategories.length - 1}</div>
            <p className="text-xs text-muted-foreground">Different types</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">PDFs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documents.filter(d => d.fileName.toLowerCase().endsWith('.pdf')).length}
            </div>
            <p className="text-xs text-muted-foreground">Contract files</p>
          </CardContent>
        </Card>
      </div>

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Documents
            <Badge variant="outline">{filteredDocuments.length} files</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">File</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Size</th>
                  <th className="text-left py-3 px-4">Uploaded By</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getFileIcon(doc.fileName)}
                        <div className="ml-3">
                          <div className="font-medium">{doc.fileName}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {doc.filePath}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{doc.category}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{formatFileSize(doc.fileSizeKb)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        {doc.uploader}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {format(doc.uploadDate, 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
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

export default DocumentManagement;