-- Table to store all users (Organizers and Clients)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Suitable for Supabase Auth integration
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    role TEXT NOT NULL CHECK (role IN ('organizer', 'client')), -- Restricts valid roles
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Main table for each wedding project
CREATE TABLE weddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The organizer in charge
    wedding_title TEXT NOT NULL, -- Example: "John & Jane's Wedding"
    partner1_name TEXT,
    partner2_name TEXT,
    wedding_date DATE,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Junction table to link clients (users) to a wedding
CREATE TABLE wedding_clients (
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (wedding_id, client_id) -- Composite primary key
);

-- Table for the checklist and task management
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL -- If user is deleted, the task remains
);

-- Table for the organizer's list of vendors
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Which organizer this vendor belongs to
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- Example: 'Catering', 'Photography', 'Venue'
    contact_person TEXT,
    phone_number TEXT,
    email TEXT
);

-- Junction table to link which vendors are used in which wedding
CREATE TABLE wedding_vendors (
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    PRIMARY KEY (wedding_id, vendor_id)
);

-- Table for each item in the budget
CREATE TABLE budget_items (
    id SERIAL PRIMARY KEY,
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    category TEXT,
    estimated_cost NUMERIC(12, 2) DEFAULT 0,
    actual_cost NUMERIC(12, 2) DEFAULT 0,
    paid_amount NUMERIC(12, 2) DEFAULT 0,
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid'))
);

-- Table for the guest list
CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    guest_group TEXT, -- Example: 'Groom's Family', 'Bride's Work Friends'
    rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'attending', 'declined')),
    dietary_restrictions TEXT,
    table_number INTEGER
);

-- Table to store information about uploaded documents
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    uploader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Path/URL from Supabase Storage
    file_size_kb INTEGER,
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Table for images on the Mood Board
CREATE TABLE mood_board_images (
    id SERIAL PRIMARY KEY,
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    uploader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    image_path TEXT NOT NULL, -- Path/URL from Supabase Storage
    caption TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Table for the internal messaging/chat feature
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
-- Note: Enable Supabase Realtime on the 'messages' table for chat functionality.

-- Table for events in the calendar
CREATE TABLE calendar_events (
    id SERIAL PRIMARY KEY,
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL
);