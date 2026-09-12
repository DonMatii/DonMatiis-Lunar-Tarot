import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ynzcuxucgrzlitremtus.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZaIOmE8HCMyaBa6HYAaJlQ_rV_juYTk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
