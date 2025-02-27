
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zjbdgjfvjmhwflzauvki.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqYmRnamZ2am1od2ZsemF1dmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwOTU5NTUsImV4cCI6MjA1NDY3MTk1NX0.RPDAOZppklM6vwfZXBODl81QIzSNcD-r09kvP02f8AQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
