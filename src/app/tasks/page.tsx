'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import WeddingLayout from '@/components/ui/wedding-layout';
import Header from '@/components/ui/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  addDays,
  differenceInCalendarDays,
  format,
  formatISO,
  isBefore,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import {
  CalendarDays,
  ChartSpline,
  CheckCircle2,
  ChevronRight,
  Crown,
  Filter,
  Flame,
  ListChecks,
  ListTodo,
  Rocket,
  Search,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Zap,
} from 'lucide-react';

type TaskStatus = 'backlog' | 'planning' | 'in_progress' | 'review' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
type PriorityFilter = 'all' | TaskPriority;

type SupabaseStatus = 'todo' | 'in_progress' | 'done';

interface ApiTaskMetadata {
  priority?: TaskPriority;
  category?: string;
  effort?: number;
  impact?: number;
  tags?: string[];
  statusLux?: TaskStatus;
}

interface ApiTask {
  id: number;
  weddingId: string;
  title: string;
  description: string;
  dueDate: string | null;
  status: SupabaseStatus;
  statusLux: TaskStatus;
  assigneeId: string | null;
  assignee: {
    id: string;
    name: string;
    email?: string | null;
  } | null;
  metadata: ApiTaskMetadata;
}

interface ApiTeamMember {
  id: string;
  name: string;
  email?: string | null;
  role: string;
}

interface ApiWeddingSummary {
  id: string;
  title: string;
  organizerId: string;
  partner1?: string | null;
  partner2?: string | null;
  location?: string | null;
  weddingDate?: string | null;
  couple: string;
}

interface ApiResponse {
  wedding: ApiWeddingSummary;
  tasks: ApiTask[];
  team: ApiTeamMember[];
}

interface Task {
  id: string;
  rawId: number;
  title: string;
  description: string;
  dueDate: string;
  assigneeId: string | null;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  effort: number;
  impact: number;
  tags: string[];
  metadata: ApiTaskMetadata;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string | null;
  initials: string;
  avatarClass: string;
}

interface NewTaskDraft {
  title: string;
  description: string;
  dueDate: string;
  assigneeId: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  effort: string;
  impact: string;
  tags: string;
}
const STATUS_CONFIG: Record<
  TaskStatus,
  {
    label: string;
    hint: string;
    accent: string;
    gradient: string;
    border: string;
    icon: typeof ListTodo;
  }
> = {
  backlog: {
    label: 'Backlog',
    hint: 'Dreams & ideas',
    accent: 'text-sky-600',
    gradient: 'from-sky-50 via-white to-white',
    border: 'border-sky-100',
    icon: ListTodo,
  },
  planning: {
    label: 'Planning',
    hint: 'Pre-production',
    accent: 'text-amber-600',
    gradient: 'from-amber-50 via-white to-white',
    border: 'border-amber-100',
    icon: ListChecks,
  },
  in_progress: {
    label: 'In Motion',
    hint: 'Live builds',
    accent: 'text-purple-600',
    gradient: 'from-violet-50 via-white to-white',
    border: 'border-violet-100',
    icon: Zap,
  },
  review: {
    label: 'In Review',
    hint: 'Polish & QA',
    accent: 'text-blue-600',
    gradient: 'from-blue-50 via-white to-white',
    border: 'border-blue-100',
    icon: CheckCircle2,
  },
  completed: {
    label: 'Crowned',
    hint: 'Signed off',
    accent: 'text-emerald-600',
    gradient: 'from-emerald-50 via-white to-white',
    border: 'border-emerald-100',
    icon: Crown,
  },
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: 'border-lime-200 bg-lime-50 text-lime-700',
  medium: 'border-sky-200 bg-sky-50 text-sky-700',
  high: 'border-amber-200 bg-amber-50 text-amber-700',
  critical: 'border-rose-200 bg-rose-50 text-rose-700',
};

const GRADIENT_CLASSES = [
  'bg-gradient-to-br from-rose-500 to-orange-400 text-white',
  'bg-gradient-to-br from-sky-500 to-cyan-500 text-white',
  'bg-gradient-to-br from-emerald-500 to-teal-500 text-white',
  'bg-gradient-to-br from-purple-500 to-indigo-500 text-white',
  'bg-gradient-to-br from-amber-500 to-pink-500 text-white',
];

const ROLE_TITLES: Record<string, string> = {
  organizer: 'Lead Planner',
  client: 'Client Partner',
};

const KEYWORD_CATEGORY_MAP: Array<{ keywords: string[]; category: string }> = [
  { keywords: ['floral', 'design', 'decor', 'style', 'canopy', 'aesthetic', 'mood'], category: 'Design' },
  { keywords: ['cater', 'menu', 'chef', 'dining', 'dessert', 'cocktail', 'champagne'], category: 'Culinary' },
  { keywords: ['guest', 'rsvp', 'concierge', 'welcome', 'experience'], category: 'Guest Experience' },
  { keywords: ['vendor', 'permit', 'logistics', 'transport', 'fleet', 'closure', 'shuttle'], category: 'Logistics' },
  { keywords: ['music', 'playlist', 'dj', 'band', 'sound', 'rehearsal'], category: 'Entertainment' },
  { keywords: ['beauty', 'hair', 'makeup', 'dress', 'attire'], category: 'Beauty' },
  { keywords: ['photo', 'video', 'lighting', 'drone'], category: 'Production' },
];

const FALLBACK_TEAM: ApiTeamMember[] = [
  { id: 'fallback-amelia', name: 'Amelia Carter', email: 'amelia.carter@example.com', role: 'organizer' },
  { id: 'fallback-luca', name: 'Luca Mendes', email: 'luca.mendes@example.com', role: 'client' },
  { id: 'fallback-jun', name: 'Jun Park', email: 'jun.park@example.com', role: 'client' },
];

const FALLBACK_WEDDING: ApiWeddingSummary = {
  id: 'fallback-wedding',
  title: 'Amelia & Luca | Starlit Riviera',
  organizerId: 'fallback-amelia',
  partner1: 'Amelia',
  partner2: 'Luca',
  location: 'Villa Celestia ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Amalfi Coast',
  weddingDate: '2025-04-18',
  couple: 'Amelia & Luca',
};

const FALLBACK_TASKS: ApiTask[] = [
  {
    id: 204,
    weddingId: 'fallback-wedding',
    title: 'Design celestial ceremony canopy',
    description: "Engineer the suspended constellation blooms with L'Atelier Fleur and structural rigging.",
    dueDate: '2025-02-12',
    status: 'in_progress',
    statusLux: 'planning',
    assigneeId: 'fallback-amelia',
    assignee: { id: 'fallback-amelia', name: 'Amelia Carter', email: 'amelia.carter@example.com' },
    metadata: {
      priority: 'critical',
      category: 'Design',
      effort: 8,
      impact: 9,
      tags: ['Floral', 'Ceremony', 'Signature moment'],
      statusLux: 'planning',
    },
  },
  {
    id: 205,
    weddingId: 'fallback-wedding',
    title: 'Curate welcome lounge playlist',
    description: 'Blend nu-disco and coastal jazz for the pre-ceremony champagne lounge.',
    dueDate: '2025-02-05',
    status: 'in_progress',
    statusLux: 'in_progress',
    assigneeId: 'fallback-jun',
    assignee: { id: 'fallback-jun', name: 'Jun Park', email: 'jun.park@example.com' },
    metadata: {
      priority: 'medium',
      category: 'Entertainment',
      effort: 3,
      impact: 7,
      tags: ['Music', 'Atmosphere'],
      statusLux: 'in_progress',
    },
  },
  {
    id: 206,
    weddingId: 'fallback-wedding',
    title: 'Confirm midnight fireworks permits',
    description: 'Secure coast guard clearance and sync pyro cues with the drone moment.',
    dueDate: '2025-02-10',
    status: 'in_progress',
    statusLux: 'in_progress',
    assigneeId: 'fallback-luca',
    assignee: { id: 'fallback-luca', name: 'Luca Mendes', email: 'luca.mendes@example.com' },
    metadata: {
      priority: 'high',
      category: 'Logistics',
      effort: 5,
      impact: 8,
      tags: ['Permits', 'Vendors'],
      statusLux: 'in_progress',
    },
  },
  {
    id: 207,
    weddingId: 'fallback-wedding',
    title: 'Rehearse drone light choreography',
    description: 'Coordinate the astral choreography with AeroLumina and live music cues.',
    dueDate: '2025-03-02',
    status: 'in_progress',
    statusLux: 'review',
    assigneeId: 'fallback-jun',
    assignee: { id: 'fallback-jun', name: 'Jun Park', email: 'jun.park@example.com' },
    metadata: {
      priority: 'high',
      category: 'Production',
      effort: 6,
      impact: 9,
      tags: ['Show moment', 'Technology'],
      statusLux: 'review',
    },
  },
  {
    id: 208,
    weddingId: 'fallback-wedding',
    title: 'Finalize VIP concierge flow',
    description: 'Publish guest journey touchpoints and assign concierge rotations.',
    dueDate: '2025-01-28',
    status: 'done',
    statusLux: 'completed',
    assigneeId: 'fallback-amelia',
    assignee: { id: 'fallback-amelia', name: 'Amelia Carter', email: 'amelia.carter@example.com' },
    metadata: {
      priority: 'high',
      category: 'Guest Experience',
      effort: 4,
      impact: 8,
      tags: ['Concierge', 'Operations'],
      statusLux: 'completed',
    },
  },
  {
    id: 209,
    weddingId: 'fallback-wedding',
    title: 'Draft bespoke welcome gift notes',
    description: 'Handwrite notes with celestial wax seals for each suite delivery.',
    dueDate: '2025-02-08',
    status: 'todo',
    statusLux: 'planning',
    assigneeId: 'fallback-amelia',
    assignee: { id: 'fallback-amelia', name: 'Amelia Carter', email: 'amelia.carter@example.com' },
    metadata: {
      priority: 'medium',
      category: 'Guest Experience',
      effort: 2,
      impact: 6,
      tags: ['Stationery', 'Hospitality'],
      statusLux: 'planning',
    },
  },
];

const FALLBACK_RESPONSE: ApiResponse = {
  wedding: FALLBACK_WEDDING,
  tasks: FALLBACK_TASKS,
  team: FALLBACK_TEAM,
};

const suggestTheme = (title: string) => {
  if (!title) {
    return 'Signature Celebration';
  }

  const luxeKeywords = ['Celestial', 'Aurora', 'Midnight', 'Starlit', 'Whisper'];
  const randomKeyword = luxeKeywords[title.length % luxeKeywords.length];
  return `${randomKeyword} ${title.split(' ')[0] ?? 'Soiree'}`;
};

const computeInitials = (name: string) => {
  if (!name) {
    return '??';
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? '??';
  }
  return `${parts[0]?.[0] ?? ''}${parts[parts.length - 1]?.[0] ?? ''}`.toUpperCase();
};

const normalizeDueDate = (dueDate: string | null) => {
  if (dueDate) {
    return dueDate;
  }
  return formatISO(addDays(new Date(), 14), { representation: 'date' });
};

const derivePriority = (metadata: ApiTaskMetadata, dueDate: string, status: TaskStatus): TaskPriority => {
  if (metadata.priority) {
    return metadata.priority;
  }

  if (status === 'completed') {
    return 'low';
  }

  const diff = differenceInCalendarDays(parseISO(dueDate), new Date());

  if (diff <= 2) {
    return 'critical';
  }
  if (diff <= 7) {
    return 'high';
  }
  if (diff <= 21) {
    return 'medium';
  }
  return 'low';
};

const deriveCategory = (metadata: ApiTaskMetadata, title: string, description: string): string => {
  if (metadata.category) {
    return metadata.category;
  }

  const haystack = `${title} ${description}`.toLowerCase();

  for (const entry of KEYWORD_CATEGORY_MAP) {
    if (entry.keywords.some((keyword) => haystack.includes(keyword))) {
      return entry.category;
    }
  }

  return 'General';
};

const deriveEffort = (metadata: ApiTaskMetadata, description: string): number => {
  if (typeof metadata.effort === 'number') {
    return metadata.effort;
  }

  const words = description.split(/\s+/).filter(Boolean).length;
  const effort = Math.min(13, Math.max(2, Math.round(words / 35) + 3));
  return effort;
};

const deriveImpact = (metadata: ApiTaskMetadata, priority: TaskPriority): number => {
  if (typeof metadata.impact === 'number') {
    return metadata.impact;
  }

  switch (priority) {
    case 'critical':
      return 9;
    case 'high':
      return 8;
    case 'medium':
      return 6;
    default:
      return 4;
  }
};

const deriveTags = (metadata: ApiTaskMetadata, category: string, priority: TaskPriority): string[] => {
  if (metadata.tags && metadata.tags.length) {
    return metadata.tags;
  }

  return [category, priority === 'critical' ? 'Critical Path' : 'Momentum'];
};
const mapApiTaskToLuxTask = (task: ApiTask): Task => {
  const dueDate = normalizeDueDate(task.dueDate);
  const status = task.metadata.statusLux ?? task.statusLux;
  const priority = derivePriority(task.metadata, dueDate, status);
  const category = deriveCategory(task.metadata, task.title, task.description);
  const effort = deriveEffort(task.metadata, task.description);
  const impact = deriveImpact(task.metadata, priority);
  const tags = deriveTags(task.metadata, category, priority);

  return {
    id: `task-${task.id}`,
    rawId: task.id,
    title: task.title,
    description: task.description,
    dueDate,
    assigneeId: task.assigneeId,
    assignee: task.assignee?.name ?? 'Unassigned',
    status,
    priority,
    category,
    effort,
    impact,
    tags,
    metadata: task.metadata,
  };
};

const mapApiTeamToLuxTeam = (team: ApiTeamMember[]): TeamMember[] =>
  team.map((member, index) => ({
    id: member.id,
    name: member.name,
    role: ROLE_TITLES[member.role] ?? member.role ?? 'Collaborator',
    email: member.email,
    initials: computeInitials(member.name),
    avatarClass: GRADIENT_CLASSES[index % GRADIENT_CLASSES.length],
  }));

const makeDefaultDraft = (assigneeId?: string): NewTaskDraft => ({
  title: '',
  description: '',
  dueDate: formatISO(addDays(new Date(), 5), { representation: 'date' }),
  assigneeId: assigneeId ?? '',
  status: 'planning',
  priority: 'medium',
  category: '',
  effort: '3',
  impact: '6',
  tags: '',
});

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [wedding, setWedding] = useState<ApiWeddingSummary | null>(null);
  const [theme, setTheme] = useState<string>('Signature Celebration');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [activeTab, setActiveTab] = useState<'board' | 'timeline' | 'insights'>('board');

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState<NewTaskDraft>(() => makeDefaultDraft());

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tasks', { cache: 'no-store' });
      if (!response.ok) {
        let message = 'Failed to load tasks';
        try {
          const info = await response.json();
          if (info && typeof info.error === 'string') {
            message = info.error;
          }
        } catch (parseError) {
          console.warn('unable to parse task api error payload', parseError);
        }
        message = `${message} (status ${response.status})`;
        throw new Error(message);
      }
      const data = (await response.json()) as ApiResponse;

      const mappedTasks = data.tasks.map(mapApiTaskToLuxTask);
      const mappedTeam = mapApiTeamToLuxTeam(data.team ?? []);

      setTasks(mappedTasks);
      setTeamMembers(mappedTeam);
      setWedding(data.wedding);
      setTheme(suggestTheme(data.wedding?.title ?? 'Signature Celebration'));

      setNewTask((draft) =>
        draft.assigneeId
          ? draft
          : makeDefaultDraft(mappedTeam[0]?.id),
      );
    } catch (err) {
      console.error('Failed to load tasks', err);
      const fallback = FALLBACK_RESPONSE;
      const mappedTeam = mapApiTeamToLuxTeam(fallback.team);
      setTasks(fallback.tasks.map(mapApiTaskToLuxTask));
      setTeamMembers(mappedTeam);
      setWedding(fallback.wedding);
      setTheme(suggestTheme(fallback.wedding.title));
      setNewTask((draft) => (draft.assigneeId ? draft : makeDefaultDraft(mappedTeam[0]?.id)));
      setError(
        err instanceof Error
          ? `${err.message} - showing showcase data`
          : 'Live data unavailable - showing showcase data'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const today = useMemo(() => new Date(), []);
  const eventDate = useMemo(() => {
    if (!wedding?.weddingDate) {
      return addDays(today, 90);
    }
    return parseISO(wedding.weddingDate);
  }, [today, wedding?.weddingDate]);
  const filteredTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      if (!query) {
        return matchesPriority;
      }

      const haystack = [
        task.title,
        task.description,
        task.category,
        task.assignee,
        task.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return matchesPriority && haystack.includes(query);
    });
  }, [tasks, priorityFilter, searchTerm]);

  const boardDataFull = useMemo(() => {
    return tasks.reduce<Record<TaskStatus, Task[]>>(
      (acc, task) => {
        acc[task.status].push(task);
        return acc;
      },
      { backlog: [], planning: [], in_progress: [], review: [], completed: [] },
    );
  }, [tasks]);

  const boardData = useMemo(() => {
    return filteredTasks.reduce<Record<TaskStatus, Task[]>>(
      (acc, task) => {
        acc[task.status].push(task);
        return acc;
      },
      { backlog: [], planning: [], in_progress: [], review: [], completed: [] },
    );
  }, [filteredTasks]);

  const totalTasks = tasks.length;
  const completedTasks = boardDataFull.completed;
  const completedCount = completedTasks.length;
  const progressPercent = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;

  const totalEffort = tasks.reduce((sum, task) => sum + task.effort, 0);
  const completedEffort = completedTasks.reduce((sum, task) => sum + task.effort, 0);
  const planningEffort = boardDataFull.planning.reduce((sum, task) => sum + task.effort, 0);
  const inProgressEffort = boardDataFull.in_progress.reduce((sum, task) => sum + task.effort, 0);
  const reviewEffort = boardDataFull.review.reduce((sum, task) => sum + task.effort, 0);
  const momentumScore = totalEffort
    ? Math.min(100, Math.round(((inProgressEffort + reviewEffort * 1.25) / totalEffort) * 100))
    : 0;
  const runwayConfidence = totalEffort
    ? Math.min(
        100,
        Math.round(
          ((completedEffort + planningEffort * 0.45 + inProgressEffort * 0.7) / totalEffort) * 100,
        ),
      )
    : 0;

  const dueThisWeek = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.status !== 'completed' &&
          isWithinInterval(parseISO(task.dueDate), {
            start: today,
            end: addDays(today, 7),
          }),
      ),
    [tasks, today],
  );

  const overdueTasks = useMemo(
    () =>
      tasks.filter(
        (task) => task.status !== 'completed' && isBefore(parseISO(task.dueDate), today),
      ),
    [tasks, today],
  );

  const criticalOpenTasks = useMemo(
    () => tasks.filter((task) => task.priority === 'critical' && task.status !== 'completed'),
    [tasks],
  );

  const showcaseTask = useMemo(() => {
    const open = tasks.filter((task) => task.status !== 'completed');
    open.sort((a, b) => {
      if (b.impact === a.impact) {
        return b.effort - a.effort;
      }
      return b.impact - a.impact;
    });
    return open[0];
  }, [tasks]);

  const focusTasks = useMemo(() => {
    const soonWindow = addDays(today, 10);

    return tasks
      .filter((task) => task.status !== 'completed')
      .filter((task) => {
        const due = parseISO(task.dueDate);
        return task.priority === 'critical' || isWithinInterval(due, { start: today, end: soonWindow });
      })
      .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime())
      .slice(0, 4);
  }, [tasks, today]);

  const upcomingMilestones = useMemo(() => {
    return tasks
      .filter((task) => task.status !== 'completed' && !isBefore(parseISO(task.dueDate), today))
      .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime())
      .slice(0, 4);
  }, [tasks, today]);

  const timelineTasks = useMemo(
    () =>
      filteredTasks.slice().sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime()),
    [filteredTasks],
  );

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, { total: number; completed: number; effort: number }>();

    tasks.forEach((task) => {
      const entry = map.get(task.category) ?? { total: 0, completed: 0, effort: 0 };
      entry.total += 1;
      entry.effort += task.effort;
      if (task.status === 'completed') {
        entry.completed += 1;
      }
      map.set(task.category, entry);
    });

    return Array.from(map.entries()).map(([category, stats]) => ({
      category,
      ...stats,
      completionRate: stats.total ? Math.round((stats.completed / stats.total) * 100) : 0,
    }));
  }, [tasks]);

  const teamLoad = useMemo(() => {
    const map = new Map<string, { total: number; active: number; completed: number; effort: number }>();

    tasks.forEach((task) => {
      const assignee = task.assigneeId ?? task.assignee;
      const entry = map.get(assignee) ?? { total: 0, active: 0, completed: 0, effort: 0 };
      entry.total += 1;
      entry.effort += task.effort;
      if (task.status === 'completed') {
        entry.completed += 1;
      } else {
        entry.active += 1;
      }
      map.set(assignee, entry);
    });

    return Array.from(map.entries()).map(([assigneeId, stats]) => ({
      assigneeId,
      ...stats,
      completionRate: stats.total ? Math.round((stats.completed / stats.total) * 100) : 0,
    }));
  }, [tasks]);

  const teamLookup = useMemo(() => {
    const map = new Map<string, TeamMember>();
    teamMembers.forEach((member) => {
      map.set(member.id, member);
      map.set(member.name, member);
    });
    return map;
  }, [teamMembers]);

  const smartSuggestions = useMemo(() => {
    const suggestions: Array<{ title: string; description: string; badge: string; tone: string }> = [];

    if (overdueTasks.length) {
      suggestions.push({
        title: 'Re-time the celestial choreography',
        description: `${overdueTasks.length} milestone${overdueTasks.length > 1 ? 's' : ''} drifted past today - carve out a catch-up sprint.`,
        badge: 'Timeline pulse',
        tone: 'border-rose-200 bg-rose-50 text-rose-600',
      });
    }

    if (dueThisWeek.length) {
      suggestions.push({
        title: 'Lock the next 7-day runway',
        description: `${dueThisWeek.length} deliverable${dueThisWeek.length > 1 ? 's' : ''} land within a week. Build a concierge-level standup.`,
        badge: 'Momentum',
        tone: 'border-indigo-200 bg-indigo-50 text-indigo-600',
      });
    }

    if (criticalOpenTasks.length) {
      suggestions.push({
        title: 'Escalate critical path touchpoints',
        description: `You still have ${criticalOpenTasks.length} critical path task${criticalOpenTasks.length > 1 ? 's' : ''} open - spotlight owners in tomorrow&apos;s huddle.`,
        badge: 'Critical path',
        tone: 'border-amber-200 bg-amber-50 text-amber-600',
      });
    }

    if (!suggestions.length) {
      suggestions.push({
        title: "You&apos;re ahead of the curve",
        description: 'No red flags detected. Consider layering in a surprise guest experience flourish.',
        badge: 'Glide mode',
        tone: 'border-emerald-200 bg-emerald-50 text-emerald-600',
      });
    }

    return suggestions.slice(0, 3);
  }, [criticalOpenTasks.length, dueThisWeek.length, overdueTasks.length]);

  const handleCompleteTask = useCallback(
    async (taskId: number) => {
      setTasks((prev) =>
        prev.map((task) => (task.rawId === taskId ? { ...task, status: 'completed' } : task)),
      );

      try {
        const response = await fetch('/api/tasks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: taskId, statusLux: 'completed' }),
        });

        if (!response.ok) {
          throw new Error('Failed to update task');
        }

        const { task } = (await response.json()) as { task: ApiTask };
        const mapped = mapApiTaskToLuxTask(task);

        setTasks((prev) => prev.map((item) => (item.rawId === mapped.rawId ? mapped : item)));
      } catch (err) {
        console.error(err);
        setError('We couldnÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢t sync that update. Refresh to retry.');
        fetchTasks();
      }
    },
    [fetchTasks],
  );

  const handleNewTaskSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!newTask.title.trim()) {
        return;
      }

      setIsCreating(true);
      setError(null);

      try {
        const metadata: ApiTaskMetadata = {
          priority: newTask.priority,
          category: newTask.category || undefined,
          effort: Number(newTask.effort) || undefined,
          impact: Number(newTask.impact) || undefined,
          tags: newTask.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          statusLux: newTask.status,
        };

        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTask.title.trim(),
            description:
              newTask.description.trim() ||
              'Freshly captured sparkle - add details to unlock its full glamour.',
            dueDate: newTask.dueDate,
            assigneeId: newTask.assigneeId || null,
            statusLux: newTask.status,
            metadata,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create task');
        }

        const { task } = (await response.json()) as { task: ApiTask };
        const mapped = mapApiTaskToLuxTask(task);

        setTasks((prev) => [mapped, ...prev]);
        setNewTask(makeDefaultDraft(newTask.assigneeId));
        setIsComposerOpen(false);
      } catch (err) {
        console.error(err);
        setError('We hit turbulence adding that task. Please try again.');
      } finally {
        setIsCreating(false);
      }
    },
    [newTask],
  );

  const daysToEvent = differenceInCalendarDays(eventDate, today);

  const renderLoading = () => (
    <WeddingLayout>
      <div className="space-y-8 pb-16">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Card className="h-[320px]">
          <CardContent className="h-full">
            <div className="grid h-full gap-6 lg:grid-cols-[1.35fr_1fr]">
              <Skeleton className="h-full w-full rounded-2xl" />
              <Skeleton className="h-full w-full rounded-2xl" />
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <Skeleton className="h-[680px] w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-[220px] w-full rounded-2xl" />
            <Skeleton className="h-[220px] w-full rounded-2xl" />
            <Skeleton className="h-[220px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </WeddingLayout>
  );

  if (isLoading) {
    return renderLoading();
  }

  if (error && !tasks.length) {
    return (
      <WeddingLayout>
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-2xl font-semibold">We couldn&apos;t load your runway tasks</h1>
          <p className="max-w-md text-muted-foreground">
            {error}. Confirm your Clerk session and Supabase connection, then refresh this view to resume orchestration.
          </p>
          <Button onClick={fetchTasks}>Try again</Button>
        </div>
      </WeddingLayout>
    );
  }
  return (
    <WeddingLayout>
      <div className="space-y-8 pb-16">
        <Header
          title="Celestial Task Atelier"
          subtitle="Orchestrate every luxurious detail of the production"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden lg:flex" onClick={fetchTasks}>
                <Flame className="mr-2 h-4 w-4 text-amber-500" />
                Refresh runway
              </Button>
              <Sheet open={isComposerOpen} onOpenChange={setIsComposerOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white shadow-lg shadow-purple-500/30 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Compose task
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Compose a runway task</SheetTitle>
                    <SheetDescription>
                      Give your idea a home, a deadline, and a concierge. You can refine it later.
                    </SheetDescription>
                  </SheetHeader>
                  <Separator />
                  <form onSubmit={handleNewTaskSubmit} className="flex h-full flex-col gap-5 overflow-y-auto px-4 pb-8 pt-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Task title</label>
                      <Input
                        autoFocus
                        placeholder="Design moonlit champagne reveal"
                        value={newTask.title}
                        onChange={(event) =>
                          setNewTask((prev) => ({ ...prev, title: event.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        rows={4}
                        placeholder="Spell out the guest experience, timing, and wow moment."
                        value={newTask.description}
                        onChange={(event) =>
                          setNewTask((prev) => ({ ...prev, description: event.target.value }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Due date</label>
                        <Input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(event) =>
                            setNewTask((prev) => ({ ...prev, dueDate: event.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Assignee</label>
                        <Select
                          value={newTask.assigneeId}
                          onValueChange={(value) =>
                            setNewTask((prev) => ({ ...prev, assigneeId: value }))
                          }
                        >
                          <SelectTrigger className="w-full justify-between">
                            <SelectValue placeholder="Select owner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Unassigned</SelectItem>
                            {teamMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ {member.role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                          value={newTask.status}
                          onValueChange={(value) =>
                            setNewTask((prev) => ({ ...prev, status: value as TaskStatus }))
                          }
                        >
                          <SelectTrigger className="w-full justify-between">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                              <SelectItem key={key} value={key}>
                                {config.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value) =>
                            setNewTask((prev) => ({ ...prev, priority: value as TaskPriority }))
                          }
                        >
                          <SelectTrigger className="w-full justify-between">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Input
                          placeholder="Design, Logistics, Experience..."
                          value={newTask.category}
                          onChange={(event) =>
                            setNewTask((prev) => ({ ...prev, category: event.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Effort points</label>
                        <Input
                          type="number"
                          min={1}
                          max={13}
                          value={newTask.effort}
                          onChange={(event) =>
                            setNewTask((prev) => ({ ...prev, effort: event.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Impact score</label>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={newTask.impact}
                          onChange={(event) =>
                            setNewTask((prev) => ({ ...prev, impact: event.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tags</label>
                        <Input
                          placeholder="Champagne, reveal, vendor"
                          value={newTask.tags}
                          onChange={(event) =>
                            setNewTask((prev) => ({ ...prev, tags: event.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <SheetFooter className="px-0">
                      <div className="flex gap-2">
                        <SheetClose asChild>
                          <Button variant="outline" type="button" className="flex-1">
                            Cancel
                          </Button>
                        </SheetClose>
                        <Button type="submit" className="flex-1" disabled={isCreating}>
                          <Rocket className="mr-2 h-4 w-4" />
                          {isCreating ? 'Adding...' : 'Add sparkle'}
                        </Button>
                      </div>
                    </SheetFooter>
                  </form>
                </SheetContent>
              </Sheet>
            </div>
          }
        />

        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-slate-950 via-indigo-900 to-slate-950 text-white shadow-[0_32px_120px_-40px_rgba(79,70,229,0.55)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.35),rgba(79,70,229,0.15),transparent)]" />
          <CardContent className="relative z-10 grid gap-8 p-8 lg:grid-cols-[1.35fr_1fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.2em] text-white/70">
                <Badge variant="outline" className="border-white/30 bg-white/10 text-white/90 backdrop-blur">
                  {theme}
                </Badge>
                <span className="inline-flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-300" />
                  {wedding?.couple ?? 'Signature Couple'}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-sky-200" />
                  {format(eventDate, 'MMMM d, yyyy')}
                </span>
              </div>

              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                {wedding?.location ?? 'Venue reveal in progress'}
              </h2>
              {showcaseTask && (
                <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.28em] text-white/60">Signature in motion</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-lg font-semibold">{showcaseTask.title}</p>
                      <p className="text-sm text-white/70">{showcaseTask.description}</p>
                    </div>
                    <Badge className="border-none bg-rose-500/90 text-white">
                      {showcaseTask.priority} priority
                    </Badge>
                  </div>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">In motion</p>
                  <p className="text-2xl font-semibold">{boardDataFull.in_progress.length}</p>
                  <p className="text-xs text-white/60">Live build streams</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">In review</p>
                  <p className="text-2xl font-semibold">{boardDataFull.review.length}</p>
                  <p className="text-xs text-white/60">Awaiting chef&apos;s kiss</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60">Days to curtain</p>
                  <p className="text-2xl font-semibold">{daysToEvent}</p>
                  <p className="text-xs text-white/60">To opening toast</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Show readiness</p>
                  <p className="mt-2 text-4xl font-semibold">{runwayConfidence}%</p>
                </div>
                <Badge className="border-none bg-white/20 text-white">
                  {totalTasks} tasks
                </Badge>
              </div>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                  <span>Production runway</span>
                  <span>{progressPercent}% crowned</span>
                </div>
                <Progress className="h-2 bg-white/20" value={progressPercent} />
              </div>
              <div className="mt-6 grid gap-4 text-sm text-white/80">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-300" />
                    Momentum index
                  </span>
                  <span>{momentumScore}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-sky-200" />
                    Active effort
                  </span>
                  <span>{totalEffort - completedEffort} pts</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_65px_-40px_rgba(2,6,23,0.55)] backdrop-blur">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <TabsList>
                  <TabsTrigger value="board">
                    <ListChecks className="mr-2 h-4 w-4" />
                    Board
                  </TabsTrigger>
                  <TabsTrigger value="timeline">
                    <Timer className="mr-2 h-4 w-4" />
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="insights">
                    <ChartSpline className="mr-2 h-4 w-4" />
                    Insights
                  </TabsTrigger>
                </TabsList>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="w-64 rounded-lg bg-white pl-9"
                      placeholder="Search owners, tags, or vibes"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </div>
                  <Select
                    value={priorityFilter}
                    onValueChange={(value) => setPriorityFilter(value as PriorityFilter)}
                  >
                    <SelectTrigger className="min-w-[160px] justify-between">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All priorities</SelectItem>
                      <SelectItem value="critical">
                        Critical
                      </SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPriorityFilter('all');
                      setSearchTerm('');
                    }}
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Reset
                  </Button>
                  <Badge variant="outline" className="border-dashed">
                    {filteredTasks.length} showing
                  </Badge>
                </div>
              </div>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="mt-1">
                <TabsContent value="board" className="space-y-5">
                  <ScrollArea className="-mx-1">
                    <div className="flex min-w-full flex-col gap-4 md:grid md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
                      {Object.entries(boardData).map(([status, columnTasks]) => {
                        const typedStatus = status as TaskStatus;
                        const config = STATUS_CONFIG[typedStatus];
                        const Icon = config.icon;
                        const columnEffort = columnTasks.reduce((sum, task) => sum + task.effort, 0);

                        return (
                          <Card
                            key={status}
                            className={cn(
                              'flex h-full flex-col gap-3 border bg-gradient-to-b backdrop-blur-sm',
                              config.border,
                              config.gradient,
                              'shadow-[0_20px_60px_-45px_rgba(2,6,23,0.65)]',
                            )}
                          >
                            <CardHeader className="flex flex-col gap-3 pb-0">
                              <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                  <span
                                    className={cn(
                                      'flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-inner',
                                      config.accent.replace('text-', 'bg-'),
                                    )}
                                  >
                                    <Icon className={cn('h-4 w-4', config.accent)} />
                                  </span>
                                  <div>
                                    <span>{config.label}</span>
                                    <p className="text-xs font-normal text-muted-foreground">
                                      {config.hint}
                                    </p>
                                  </div>
                                </CardTitle>
                                <Badge variant="outline" className="border-dashed">
                                  {columnTasks.length}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{columnEffort} pts</span>
                                <span>{boardDataFull[typedStatus].length} total</span>
                              </div>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col gap-3 pb-4">
                              {columnTasks.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-muted-foreground">
                                  No tasks in this lane - pull something forward.
                                </div>
                              ) : (
                                columnTasks.map((task) => {
                                  const member = teamLookup.get(task.assigneeId ?? task.assignee);
                                  return (
                                    <div
                                      key={task.id}
                                      className="group rounded-xl border border-white/40 bg-white/80 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-200 hover:shadow-lg"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div>
                                          <p className="font-semibold leading-snug">{task.title}</p>
                                          <p className="mt-1 text-sm text-muted-foreground">
                                            {task.description}
                                          </p>
                                        </div>
                                        <Badge className={cn('border capitalize', PRIORITY_STYLES[task.priority])}>
                                          {task.priority}
                                        </Badge>
                                      </div>
                                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                        <span className="inline-flex items-center gap-1">
                                          <CalendarDays className="h-3.5 w-3.5" />
                                          {format(parseISO(task.dueDate), 'MMM d')}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                          <Target className="h-3.5 w-3.5" />
                                          {task.category}
                                        </span>
                                        <span className="inline-flex items-center gap-2">
                                          <Avatar className="h-7 w-7">
                                            <AvatarFallback
                                              className={cn(
                                                'text-[11px] font-semibold uppercase',
                                                member?.avatarClass ?? 'bg-muted',
                                              )}
                                            >
                                              {member?.initials ?? computeInitials(task.assignee)}
                                            </AvatarFallback>
                                          </Avatar>
                                          {task.assignee}
                                        </span>
                                      </div>
                                      {task.tags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                          {task.tags.slice(0, 3).map((tag) => (
                                            <Badge
                                              key={tag}
                                              variant="outline"
                                              className="border-dashed text-[11px] uppercase tracking-[0.18em]"
                                            >
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="timeline" className="space-y-6">
                  <div className="relative pl-2">
                    <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
                    <div className="space-y-6">
                      {timelineTasks.map((task) => {
                        const due = parseISO(task.dueDate);
                        const delta = differenceInCalendarDays(due, today);
                        const isLate = delta < 0 && task.status !== 'completed';
                        const Icon = STATUS_CONFIG[task.status].icon;

                        return (
                          <div key={task.id} className="relative pl-12">
                            <span
                              className={cn(
                                'absolute left-[1.35rem] top-4 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border bg-white shadow-sm',
                                isLate ? 'border-rose-300 text-rose-500' : 'border-indigo-200 text-indigo-500',
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_12px_50px_-45px_rgba(2,6,23,0.65)] backdrop-blur">
                              <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                  <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                                    {delta === 0
                                      ? 'Due today'
                                      : delta > 0
                                      ? `${delta} day${delta > 1 ? 's' : ''} out`
                                      : `${Math.abs(delta)} day${Math.abs(delta) > 1 ? 's' : ''} overdue`}
                                  </p>
                                  <h3 className="mt-1 text-lg font-semibold">{task.title}</h3>
                                  <p className="text-sm text-muted-foreground">{task.description}</p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'border capitalize',
                                    STATUS_CONFIG[task.status].accent.replace('text-', 'border-'),
                                    STATUS_CONFIG[task.status].accent,
                                  )}
                                >
                                  {STATUS_CONFIG[task.status].label}
                                </Badge>
                              </div>
                              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-2">
                                  <CalendarDays className="h-4 w-4" />
                                  {format(due, 'EEE, MMM d')}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                  <Target className="h-4 w-4" />
                                  {task.category}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                  <Avatar className="h-7 w-7">
                                    <AvatarFallback
                                      className={cn(
                                        'text-[11px] font-semibold uppercase',
                                        teamLookup.get(task.assigneeId ?? task.assignee)?.avatarClass ?? 'bg-muted',
                                      )}
                                    >
                                      {teamLookup.get(task.assigneeId ?? task.assignee)?.initials ?? computeInitials(task.assignee)}
                                    </AvatarFallback>
                                  </Avatar>
                                  {task.assignee}
                                </span>
                              </div>
                              {task.tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {task.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="border-dashed uppercase tracking-[0.18em] text-[11px]">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-white">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-base">
                          Category velocity
                          <Badge variant="outline" className="border-dashed">
                            {categoryBreakdown.length} streams
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {categoryBreakdown.map((category) => (
                          <div key={category.category}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span className="font-medium">{category.category}</span>
                              <span className="text-muted-foreground">
                                {category.completed}/{category.total} crowned
                              </span>
                            </div>
                            <Progress value={category.completionRate} className="h-2.5" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <TrendingUp className="h-4 w-4 text-indigo-500" />
                          Forecast
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-muted-foreground">Momentum score</span>
                          <span className="font-medium">{momentumScore}/100</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-muted-foreground">Critical runway</span>
                          <span className="font-medium">
                            {criticalOpenTasks.length} task{criticalOpenTasks.length === 1 ? '' : 's'}
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-muted-foreground">Overdue flair</span>
                          <span className={cn('font-medium', overdueTasks.length ? 'text-rose-600' : 'text-emerald-600')}>
                            {overdueTasks.length === 0 ? 'All clear' : `${overdueTasks.length} to recover`}
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-muted-foreground">Week-ahead commitments</span>
                          <span className="font-medium">
                            {dueThisWeek.length} deliverable{dueThisWeek.length === 1 ? '' : 's'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        Concierge suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-3">
                      {smartSuggestions.map((suggestion) => (
                        <div
                          key={suggestion.title}
                          className={cn(
                            'flex h-full flex-col justify-between gap-3 rounded-xl border p-4',
                            suggestion.tone,
                          )}
                        >
                          <div>
                            <p className="text-xs uppercase tracking-[0.24em]">{suggestion.badge}</p>
                            <p className="mt-2 text-sm font-semibold">{suggestion.title}</p>
                            <p className="mt-2 text-sm leading-relaxed">{suggestion.description}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-medium">
                            Lean in
                            <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          <aside className="space-y-6">
            <Card className="border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="inline-flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    Focus runway
                  </span>
                  <Badge variant="outline" className="border-dashed">
                    {focusTasks.length} queued
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {focusTasks.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-purple-200 bg-white/80 p-4 text-sm text-muted-foreground">
                    Every critical path is polished. Time to dream up a surprise flourish.
                  </p>
                ) : (
                  focusTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-purple-100 bg-white/80 p-3 shadow-[0_12px_50px_-45px_rgba(109,40,217,0.65)]"
                    >
                      <div className="flex flex-1 items-start gap-3">
                        <Checkbox className="mt-1" onCheckedChange={() => handleCompleteTask(task.rawId)} />
                        <div className="space-y-1.5">
                          <p className="font-medium leading-snug">{task.title}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="border-dashed bg-purple-100/60 text-purple-600">
                              {format(parseISO(task.dueDate), 'MMM d')}
                            </Badge>
                            <span>{task.assignee}</span>
                            <span>{task.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarDays className="h-4 w-4 text-sky-500" />
                  Upcoming milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingMilestones.map((task) => (
                  <div key={task.id} className="rounded-xl border border-sky-100 bg-white/80 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.category}</p>
                      </div>
                      <Badge variant="outline" className="border-dashed text-xs">
                        {format(parseISO(task.dueDate), 'MMM d')}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Owned by {task.assignee}</span>
                      <span className="capitalize">{task.priority}</span>
                    </div>
                  </div>
                ))}
                {upcomingMilestones.length === 0 && (
                  <p className="rounded-xl border border-dashed border-sky-200 bg-white/70 p-3 text-sm text-muted-foreground">
                    No upcoming milestones - take a beat to celebrate the glide.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Flame className="h-4 w-4 text-amber-500" />
                  Concierge cues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {smartSuggestions.map((suggestion) => (
                  <div key={suggestion.title} className={cn('rounded-xl border p-3', suggestion.tone)}>
                    <p className="text-xs uppercase tracking-[0.22em]">{suggestion.badge}</p>
                    <p className="mt-1 font-medium">{suggestion.title}</p>
                    <p className="mt-1 text-muted-foreground">{suggestion.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Team pulse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.map((member) => {
                  const stats =
                    teamLoad.find((entry) => entry.assigneeId === member.id || entry.assigneeId === member.name) ?? {
                      total: 0,
                      active: 0,
                      completed: 0,
                      effort: 0,
                      completionRate: 0,
                    };

                  return (
                    <div key={member.id} className="rounded-xl border border-emerald-100/70 bg-white/80 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className={cn('text-[11px] font-semibold uppercase', member.avatarClass)}>
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-dashed text-xs">
                          {stats.active} live | {stats.completed} done
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <Progress value={stats.completionRate} className="h-2" />
                        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                          <span>{stats.completionRate}% crowned</span>
                          <span>{stats.effort} pts total</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </WeddingLayout>
  );
};

export default TasksPage;







