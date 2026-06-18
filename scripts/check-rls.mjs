import { createClient } from '@supabase/supabase-js';

const URL = 'https://gitjchzvmskzenjlyvkc.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(URL, KEY, { auth: { persistSession: false } });

// Query pg_policies via raw SQL using Supabase's built-in sql endpoint
const res = await fetch(`${URL}/rest/v1/rpc/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${KEY}`,
    'apikey': KEY,
  },
});

// Try supabase-js .rpc for raw SQL
// Supabase doesn't expose pg_policies by default — use the management API or check via the dashboard
// Instead, let's try a test insert to see if service role key bypasses RLS
console.log('\n── Testing if service role key bypasses RLS ─────────');
console.log('Method: attempt a simple SELECT to confirm connection works');

const { data, error } = await sb
  .from('pet_names')
  .select('id')
  .limit(1);

if (error) {
  console.log('  ERROR:', error.message);
  console.log('  Code:', error.code);
} else {
  console.log('  SELECT works with service role key — RLS not blocking reads');
  console.log('  Row returned:', data);
}

// Check if there are any RLS-related errors by trying to read from pg_policies
// The service role key bypasses RLS by design in Supabase
console.log('\n── Supabase Service Role Key behavior ───────────────');
console.log('  The Supabase service role key ALWAYS bypasses RLS policies.');
console.log('  It has full read/write access regardless of any RLS policies set.');
console.log('  Bulk insert via service role key will succeed even if RLS is enabled.');
