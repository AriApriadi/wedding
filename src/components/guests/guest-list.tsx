import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Utensils } from 'lucide-react';

interface GuestItemProps {
  name: string;
  email?: string;
  phone?: string;
  group: string;
  rsvpStatus: 'pending' | 'attending' | 'declined';
  dietaryRestrictions?: string;
}

const GuestItem = ({ name, email, phone, group, rsvpStatus, dietaryRestrictions }: GuestItemProps) => {
  const statusColors = {
    pending: 'bg-yellow-500',
    attending: 'bg-green-500',
    declined: 'bg-red-500',
  };

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div>
        <h3 className="font-medium">{name}</h3>
        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
          {email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              {email}
            </div>
          )}
          {phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              {phone}
            </div>
          )}
          {dietaryRestrictions && (
            <div className="flex items-center">
              <Utensils className="h-4 w-4 mr-1" />
              {dietaryRestrictions}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline">{group}</Badge>
        <Badge variant="outline" className={`${statusColors[rsvpStatus]} text-white`}>
          {rsvpStatus}
        </Badge>
      </div>
    </div>
  );
};

interface GuestListProps {
  title: string;
  guests: GuestItemProps[];
}

const GuestList = ({ title, guests }: GuestListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="secondary">{guests.length} guests</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {guests.map((guest, index) => (
          <GuestItem key={index} {...guest} />
        ))}
      </CardContent>
    </Card>
  );
};

export default GuestList;