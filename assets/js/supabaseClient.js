import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ynzcuxucgrzlitremtus.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluemN4dWN1Z3J6bGl0cmVtdHVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNzEyNTUsImV4cCI6MjEwNDc0NzI1NX0.d3DQliKqJHzdhQtcQlOGM-vLPpl5QZP5WKmH-wfchXM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
