import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

interface WeddingCardProps {
  title: string;
  coupleNames: string;
  date: Date;
  location: string;
  status: 'planning' | 'confirmed' | 'completed';
  guestCount: number;
}

const WeddingCard = ({ title, coupleNames, date, location, status, guestCount }: WeddingCardProps) => {
  const statusColors = {
    planning: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    completed: 'bg-green-500',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{coupleNames}</CardDescription>
          </div>
          <Badge variant="outline" className={`${statusColors[status]} text-white`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          {format(date, 'PPP')}
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-2" />
          {location}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-2" />
          {guestCount} guests
        </div>
      </CardContent>
    </Card>
  );
};

export default WeddingCard;