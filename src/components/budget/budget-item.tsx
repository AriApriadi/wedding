import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

interface BudgetItemProps {
  name: string;
  category: string;
  estimated: number;
  actual: number;
  paid: number;
  status: 'unpaid' | 'partial' | 'paid';
}

const BudgetItem = ({ name, category, estimated, actual, paid, status }: BudgetItemProps) => {
  const statusColors = {
    unpaid: 'bg-red-500',
    partial: 'bg-yellow-500',
    paid: 'bg-green-500',
  };

  const progress = actual > 0 ? (paid / actual) * 100 : 0;
  const remaining = actual - paid;

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>{category}</CardDescription>
        </div>
        <Badge variant="outline" className={`${statusColors[status]} text-white`}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Estimated</p>
            <p className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {estimated.toLocaleString('en-US')}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Actual</p>
            <p className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {actual.toLocaleString('en-US')}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Paid</p>
            <p className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {paid.toLocaleString('en-US')}
            </p>
          </div>
        </div>
        <div className="mb-2 flex justify-between text-sm">
          <span>Payment Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2 mb-2" />
        <div className="flex justify-between items-center">
          <p className="text-sm">
            <span className="text-muted-foreground">Remaining: </span>
            <span className="font-medium">
              <DollarSign className="h-3 w-3 inline mr-1" />
              {remaining.toLocaleString('en-US')}
            </span>
          </p>
          <div className="flex items-center">
            {actual > estimated ? (
              <div className="flex items-center text-red-500 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                Over budget
              </div>
            ) : (
              <div className="flex items-center text-green-500 text-sm">
                <TrendingDown className="h-4 w-4 mr-1" />
                On budget
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetItem;