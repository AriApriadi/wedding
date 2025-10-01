import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { differenceInCalendarDays } from 'date-fns';

import { createSupabaseServerClient } from '@/lib/supabase';

const METADATA_PREFIX = '<!--meta:';
const METADATA_SUFFIX = '-->';

type SupabaseTaskStatus = 'todo' | 'in_progress' | 'done';
type LuxTaskStatus = 'backlog' | 'planning' | 'in_progress' | 'review' | 'completed';

type TaskMetadata = {
  priority?: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  effort?: number;
  impact?: number;
  tags?: string[];
  statusLux?: LuxTaskStatus;
};

type TaskRow = {
  id: number;
  wedding_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: SupabaseTaskStatus;
  assignee_id: string | null;
  assignee?: {
    id: string;
    full_name: string | null;
    email: string | null;
  } | null;
};

type WeddingRow = {
  id: string;
  wedding_title: string;
  partner1_name: string | null;
  partner2_name: string | null;
  wedding_date: string | null;
  location: string | null;
  organizer_id: string;
};

type UserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
};

function parseTaskDescription(description: string | null) {
  if (!description) {
    return { cleanDescription: '', metadata: {} as TaskMetadata };
  }

  const prefixIndex = description.lastIndexOf(METADATA_PREFIX);

  if (prefixIndex === -1) {
    return { cleanDescription: description, metadata: {} as TaskMetadata };
  }

  const start = prefixIndex + METADATA_PREFIX.length;
  const end = description.indexOf(METADATA_SUFFIX, start);

  if (end === -1) {
    return { cleanDescription: description, metadata: {} as TaskMetadata };
  }

  const metaString = description.slice(start, end).trim();
  let metadata: TaskMetadata = {};

  try {
    metadata = JSON.parse(metaString);
  } catch (error) {
    console.warn('Failed to parse task metadata', error);
  }

  const cleanDescription = `${description.slice(0, prefixIndex).trim()} ${description
    .slice(end + METADATA_SUFFIX.length)
    .trim()}`.trim();

  return { cleanDescription, metadata };
}

function appendMetadataToDescription(description: string, metadata: TaskMetadata) {
  const base = description.trim();
  const meta = `${METADATA_PREFIX}${JSON.stringify(metadata)}${METADATA_SUFFIX}`;
  return `${base}\n\n${meta}`;
}

function luxStatusFromMetadataOrGuess(
  supabaseStatus: SupabaseTaskStatus,
  metadata: TaskMetadata,
  dueDate: string | null,
): LuxTaskStatus {
  if (metadata.statusLux && LUX_STATUSES.includes(metadata.statusLux)) {
    return metadata.statusLux;
  }

  if (supabaseStatus === 'done') {
    return 'completed';
  }

  const now = new Date();
  const due = dueDate ? new Date(dueDate) : null;

  if (supabaseStatus === 'in_progress') {
    if (due) {
      const delta = differenceInCalendarDays(due, now);
      if (delta <= 2) {
        return 'review';
      }
    }
    return 'in_progress';
  }

  if (due) {
    const delta = differenceInCalendarDays(due, now);
    if (delta > 21) {
      return 'backlog';
    }
    if (delta <= 2) {
      return 'review';
    }
  }

  return 'planning';
}

const LUX_STATUSES: LuxTaskStatus[] = ['backlog', 'planning', 'in_progress', 'review', 'completed'];

function mapLuxToSupabaseStatus(status: LuxTaskStatus): SupabaseTaskStatus {
  switch (status) {
    case 'completed':
      return 'done';
    case 'in_progress':
    case 'review':
      return 'in_progress';
    case 'backlog':
    case 'planning':
    default:
      return 'todo';
  }
}

function sanitizeMetadata(metadata: TaskMetadata | undefined): TaskMetadata {
  if (!metadata) {
    return {};
  }

  const safeTags = Array.isArray(metadata.tags)
    ? metadata.tags.filter((tag): tag is string => typeof tag === 'string')
    : undefined;

  return {
    priority: LUX_PRIORITIES.includes(metadata.priority ?? '')
      ? (metadata.priority as TaskMetadata['priority'])
      : undefined,
    category: typeof metadata.category === 'string' ? metadata.category : undefined,
    effort:
      typeof metadata.effort === 'number' && Number.isFinite(metadata.effort)
        ? metadata.effort
        : undefined,
    impact:
      typeof metadata.impact === 'number' && Number.isFinite(metadata.impact)
        ? metadata.impact
        : undefined,
    tags: safeTags,
    statusLux: metadata.statusLux && LUX_STATUSES.includes(metadata.statusLux)
      ? metadata.statusLux
      : undefined,
  };
}

const LUX_PRIORITIES = ['low', 'medium', 'high', 'critical'];

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  const searchParams = request.nextUrl.searchParams;
  const requestedWeddingId = searchParams.get('weddingId');

  let wedding: WeddingRow | null = null;

  if (requestedWeddingId) {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('id', requestedWeddingId)
      .maybeSingle();

    if (error) {
      console.error('Failed to load wedding by id', error);
      return NextResponse.json({ error: 'Failed to load wedding' }, { status: 500 });
    }

    if (!data || data.organizer_id !== userId) {
      return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
    }

    wedding = data as WeddingRow;
  } else {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('organizer_id', userId)
      .order('wedding_date', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Failed to load default wedding', error);
      return NextResponse.json({ error: 'Failed to load wedding' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'No weddings found' }, { status: 404 });
    }

    wedding = data as WeddingRow;
  }

  const { data: taskRows, error: tasksError } = await supabase
    .from('tasks')
    .select(
      `id, wedding_id, title, description, due_date, status, assignee_id,
       assignee:users!tasks_assignee_id_fkey(id, full_name, email)`
    )
    .eq('wedding_id', wedding.id)
    .order('due_date', { ascending: true });

  if (tasksError) {
    console.error('Failed to load tasks', tasksError);
    return NextResponse.json({ error: 'Failed to load tasks' }, { status: 500 });
  }

  const parsedTasks = (taskRows as TaskRow[]).map((task) => {
    const { cleanDescription, metadata } = parseTaskDescription(task.description);
    const safeMetadata = sanitizeMetadata(metadata);
    const statusLux = luxStatusFromMetadataOrGuess(task.status, safeMetadata, task.due_date);

    return {
      id: task.id,
      weddingId: task.wedding_id,
      title: task.title,
      description: cleanDescription,
      dueDate: task.due_date,
      status: task.status,
      statusLux,
      assigneeId: task.assignee_id,
      assignee: task.assignee
        ? {
            id: task.assignee.id,
            name: task.assignee.full_name ?? task.assignee.email ?? 'Unnamed',
            email: task.assignee.email,
          }
        : null,
      metadata: safeMetadata,
    };
  });

  const participantIds = new Set<string>();
  participantIds.add(wedding.organizer_id);

  parsedTasks
    .map((task) => task.assigneeId)
    .filter((id): id is string => Boolean(id))
    .forEach((id) => participantIds.add(id));

  const { data: clientRows, error: clientsError } = await supabase
    .from('wedding_clients')
    .select('client_id')
    .eq('wedding_id', wedding.id);

  if (clientsError) {
    console.warn('Failed to load wedding clients', clientsError);
  } else {
    (clientRows ?? [])
      .map((row) => row.client_id)
      .filter((id): id is string => Boolean(id))
      .forEach((id) => participantIds.add(id));
  }

  const participantIdList = Array.from(participantIds);

  let participantData: UserRow[] = [];

  if (participantIdList.length > 0) {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, role')
      .in('id', participantIdList);

    if (error) {
      console.warn('Failed to load participant user records', error);
    } else {
      participantData = data as UserRow[];
    }
  }

  const team = participantData.map((user) => ({
    id: user.id,
    name: user.full_name ?? user.email ?? 'Unnamed',
    email: user.email,
    role: user.role ?? 'collaborator',
  }));

  return NextResponse.json({
    wedding: {
      id: wedding.id,
      title: wedding.wedding_title,
      organizerId: wedding.organizer_id,
      partner1: wedding.partner1_name,
      partner2: wedding.partner2_name,
      location: wedding.location,
      weddingDate: wedding.wedding_date,
      couple:
        wedding.partner1_name && wedding.partner2_name
          ? `${wedding.partner1_name} & ${wedding.partner2_name}`
          : wedding.wedding_title,
    },
    tasks: parsedTasks,
    team,
  });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  const payload = await request.json();

  const {
    weddingId,
    title,
    description,
    dueDate,
    statusLux,
    assigneeId,
    metadata,
  } = payload ?? {};

  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  let resolvedWeddingId: string | null = typeof weddingId === 'string' ? weddingId : null;

  if (!resolvedWeddingId) {
    const { data, error } = await supabase
      .from('weddings')
      .select('id')
      .eq('organizer_id', userId)
      .order('wedding_date', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Failed to resolve default wedding for creation', error);
      return NextResponse.json({ error: 'Failed to resolve wedding' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'No wedding available for creation' }, { status: 400 });
    }

    resolvedWeddingId = data.id;
  }

  const safeMetadata = sanitizeMetadata(metadata);

  const serializedDescription = appendMetadataToDescription(description ?? '', safeMetadata);

  const supabaseStatus = mapLuxToSupabaseStatus(statusLux ?? 'planning');

  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        wedding_id: resolvedWeddingId,
        title,
        description: serializedDescription,
        due_date: dueDate ?? null,
        status: supabaseStatus,
        assignee_id: typeof assigneeId === 'string' ? assigneeId : null,
      },
    ])
    .select(
      `id, wedding_id, title, description, due_date, status, assignee_id,
       assignee:users!tasks_assignee_id_fkey(id, full_name, email)`
    )
    .maybeSingle();

  if (error || !data) {
    console.error('Failed to create task', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }

  const { cleanDescription, metadata: createdMeta } = parseTaskDescription(data.description);
  const meta = sanitizeMetadata({ ...safeMetadata, ...createdMeta });
  const statusLuxResolved = luxStatusFromMetadataOrGuess(data.status, meta, data.due_date);

  return NextResponse.json({
    task: {
      id: data.id,
      weddingId: data.wedding_id,
      title: data.title,
      description: cleanDescription,
      dueDate: data.due_date,
      status: data.status,
      statusLux: statusLuxResolved,
      assigneeId: data.assignee_id,
      assignee: data.assignee
        ? {
            id: data.assignee.id,
            name: data.assignee.full_name ?? data.assignee.email ?? 'Unnamed',
            email: data.assignee.email,
          }
        : null,
      metadata: meta,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  const payload = await request.json();
  const { id, statusLux, metadata } = payload ?? {};

  if (typeof id !== 'number') {
    return NextResponse.json({ error: 'Task id is required' }, { status: 400 });
  }

  const safeMetadata = sanitizeMetadata(metadata);
  const updates: Record<string, unknown> = {};

  if (statusLux) {
    updates.status = mapLuxToSupabaseStatus(statusLux);
  }

  if (metadata) {
    const { data: existingRow, error: fetchError } = await supabase
      .from('tasks')
      .select('description')
      .eq('id', id)
      .maybeSingle();

    if (fetchError || !existingRow) {
      console.error('Failed to fetch existing task for metadata update', fetchError);
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const { cleanDescription } = parseTaskDescription(existingRow.description);
    updates.description = appendMetadataToDescription(cleanDescription, safeMetadata);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select(
      `id, wedding_id, title, description, due_date, status, assignee_id,
       assignee:users!tasks_assignee_id_fkey(id, full_name, email)`
    )
    .maybeSingle();

  if (error || !data) {
    console.error('Failed to update task', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }

  const { cleanDescription, metadata: updatedMeta } = parseTaskDescription(data.description);
  const combinedMeta = sanitizeMetadata({ ...safeMetadata, ...updatedMeta });
  const statusLuxResolved = luxStatusFromMetadataOrGuess(data.status, combinedMeta, data.due_date);

  return NextResponse.json({
    task: {
      id: data.id,
      weddingId: data.wedding_id,
      title: data.title,
      description: cleanDescription,
      dueDate: data.due_date,
      status: data.status,
      statusLux: statusLuxResolved,
      assigneeId: data.assignee_id,
      assignee: data.assignee
        ? {
            id: data.assignee.id,
            name: data.assignee.full_name ?? data.assignee.email ?? 'Unnamed',
            email: data.assignee.email,
          }
        : null,
      metadata: combinedMeta,
    },
  });
}
