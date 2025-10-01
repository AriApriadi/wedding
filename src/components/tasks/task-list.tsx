'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

interface TaskItemProps {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  assignee?: string;
  status: 'todo' | 'in_progress' | 'done';
}

const TaskItem = ({ title, description, dueDate, assignee, status }: TaskItemProps) => {
  const statusColors = {
    todo: 'bg-gray-500',
    'in_progress': 'bg-blue-500',
    done: 'bg-green-500',
  };

  return (
    <div className="flex items-start space-x-4 p-4 border-b last:border-b-0">
      <Checkbox className="mt-1" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{title}</h3>
          <Badge variant="outline" className={`${statusColors[status]} text-white`}>
            {status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          {dueDate && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {format(dueDate, 'MMM dd, yyyy')}
            </div>
          )}
          {assignee && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {assignee}
            </div>
          )}
        </div>
      </div>
      <button className="p-1 rounded hover:bg-muted">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
};

interface TaskListProps {
  title: string;
  tasks: TaskItemProps[];
}

const TaskList = ({ title, tasks }: TaskListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="secondary">{tasks.length} tasks</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {tasks.map((task) => (
          <TaskItem key={task.id} {...task} />
        ))}
      </CardContent>
    </Card>
  );
};

export default TaskList;