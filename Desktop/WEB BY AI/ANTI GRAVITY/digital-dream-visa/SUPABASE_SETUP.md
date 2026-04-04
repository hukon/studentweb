# Supabase Configuration Guide

To power the consultation request form on your new Digital Dream Visa Next.js application, you need to set up a Supabase project. Follow these steps to configure your database.

## 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click "New Project", select your organization, name your project (e.g., `digital-dream-visa`), and provide a secure database password.
3. Wait for the project to provision.

## 2. Execute SQL Schema
Once the project is ready, navigate to the **SQL Editor** from the left-hand menu and paste the following SQL to create your `consultations` table.

```sql
-- Create the consultations table
CREATE TABLE public.consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    visa_type TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending'::text,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Allow inserts from the service role (used by our Next.js Server Action)
-- Note: Since we use SUPABASE_SERVICE_ROLE_KEY on the server backend,
-- it bypasses RLS naturally, but keeping RLS enabled on the table ensures
-- safety from anonymous client-side direct inserts.
```

## 3. Retrieve Credentials
1. Go to **Project Settings** -> **API**.
2. Copy the **Project URL** and the **`service_role` secret key**.
3. In your Next.js project root, create a file named `.env.local` if it doesn't already exist.
4. Add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> **WARNING**: Never expose your `SUPABASE_SERVICE_ROLE_KEY` in client-side code (never prefix it with `NEXT_PUBLIC_`). The currently implemented Next.js Server Action ensures securely processing form submissions from the backend.
