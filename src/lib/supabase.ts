import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xoaykmxzgqwywfxmfplk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvYXlrbXh6Z3F3eXdmeG1mcGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzYwMjcsImV4cCI6MjA5MDExMjAyN30.SPtDi9lRx0lR6SlUw4jQHRldacfvRX8M__3W1Z1TSyQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
