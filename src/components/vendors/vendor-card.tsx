import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, User } from 'lucide-react';

interface VendorCardProps {
  name: string;
  category: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  rating?: number;
}

const VendorCard = ({ name, category, contactPerson, email, phone, rating }: VendorCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{name}</CardTitle>
            <CardDescription>{category}</CardDescription>
          </div>
          {rating && (
            <Badge variant="outline">
              {rating.toFixed(1)} ★
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {contactPerson && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <User className="h-4 w-4 mr-2" />
            Contact: {contactPerson}
          </div>
        )}
        {email && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Mail className="h-4 w-4 mr-2" />
            {email}
          </div>
        )}
        {phone && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Phone className="h-4 w-4 mr-2" />
            {phone}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorCard;