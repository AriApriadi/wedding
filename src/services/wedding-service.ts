import { supabase } from '@/lib/supabase';

// Types based on the database schema
export type User = {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  role: 'organizer' | 'client';
  created_at: string;
};

export type Wedding = {
  id: string;
  organizer_id: string;
  wedding_title: string;
  partner1_name?: string;
  partner2_name?: string;
  wedding_date?: string;
  location?: string;
  created_at: string;
};

export type Task = {
  id: number;
  wedding_id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: 'todo' | 'in_progress' | 'done';
  assignee_id?: string;
};

export type Vendor = {
  id: number;
  organizer_id: string;
  name: string;
  category: string;
  contact_person?: string;
  phone_number?: string;
  email?: string;
};

export type BudgetItem = {
  id: number;
  wedding_id: string;
  item_name: string;
  category?: string;
  estimated_cost: number;
  actual_cost: number;
  paid_amount: number;
  payment_status: 'unpaid' | 'partial' | 'paid';
};

export type Guest = {
  id: number;
  wedding_id: string;
  full_name: string;
  guest_group?: string;
  rsvp_status: 'pending' | 'attending' | 'declined';
  dietary_restrictions?: string;
  table_number?: number;
};

export type Document = {
  id: number;
  wedding_id: string;
  uploader_id?: string;
  file_name: string;
  file_path: string;
  file_size_kb?: number;
  uploaded_at: string;
};

export type MoodBoardImage = {
  id: number;
  wedding_id: string;
  uploader_id?: string;
  image_path: string;
  caption?: string;
  uploaded_at: string;
};

export type Message = {
  id: number;
  wedding_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export type CalendarEvent = {
  id: number;
  wedding_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
};

// User service functions
export const userService = {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as User;
  }
};

// Wedding service functions
export const weddingService = {
  async getWeddingsByOrganizer(organizerId: string) {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('organizer_id', organizerId);
    
    if (error) throw error;
    return data as Wedding[];
  },

  async getWeddingById(id: string) {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Wedding;
  },

  async createWedding(wedding: Omit<Wedding, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('weddings')
      .insert([wedding])
      .select()
      .single();
    
    if (error) throw error;
    return data as Wedding;
  }
};

// Task service functions
export const taskService = {
  async getTasksByWedding(weddingId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('wedding_id', weddingId);
    
    if (error) throw error;
    return data as Task[];
  },

  async createTask(task: Omit<Task, 'id'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    
    if (error) throw error;
    return data as Task;
  },

  async updateTask(id: number, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Task;
  }
};

// Vendor service functions
export const vendorService = {
  async getVendorsByOrganizer(organizerId: string) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('organizer_id', organizerId);
    
    if (error) throw error;
    return data as Vendor[];
  },

  async createVendor(vendor: Omit<Vendor, 'id'>) {
    const { data, error } = await supabase
      .from('vendors')
      .insert([vendor])
      .select()
      .single();
    
    if (error) throw error;
    return data as Vendor;
  }
};

// Budget service functions
export const budgetService = {
  async getBudgetItemsByWedding(weddingId: string) {
    const { data, error } = await supabase
      .from('budget_items')
      .select('*')
      .eq('wedding_id', weddingId);
    
    if (error) throw error;
    return data as BudgetItem[];
  },

  async createBudgetItem(budgetItem: Omit<BudgetItem, 'id'>) {
    const { data, error } = await supabase
      .from('budget_items')
      .insert([budgetItem])
      .select()
      .single();
    
    if (error) throw error;
    return data as BudgetItem;
  }
};

// Guest service functions
export const guestService = {
  async getGuestsByWedding(weddingId: string) {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('wedding_id', weddingId);
    
    if (error) throw error;
    return data as Guest[];
  },

  async createGuest(guest: Omit<Guest, 'id'>) {
    const { data, error } = await supabase
      .from('guests')
      .insert([guest])
      .select()
      .single();
    
    if (error) throw error;
    return data as Guest;
  }
};