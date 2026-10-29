import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xifxzpyrpcecgwavvaue.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpZnh6cHlycGNlY2d3YXZ2YXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3OTMxNDMsImV4cCI6MjEwNzM2OTE0M30.j3Kvgp6Ux5oTI_9GE4ucr5PDbBfmr5d58nOFXGcpqok';

let client: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  return client;
};
