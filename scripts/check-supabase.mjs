/**
 * Read-only Supabase status check.
 * Run: node scripts/check-supabase.mjs
 */
import { createClient } from '@supabase/supabase-js';

const URL  = 'https://gitjchzvmskzenjlyvkc.supabase.co';
const KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!KEY) { console.error('Set SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }

const sb = createClient(URL, KEY, { auth: { persistSession: false } });

async function run() {
  console.log('\n── pet_names row count ──────────────────────');
  const { count, error } = await sb
    .from('pet_names')
    .select('*', { count: 'exact', head: true });
  if (error) console.error('pet_names:', error.message);
  else console.log(`  rows: ${count}`);

  console.log('\n── pet_swipes row count ─────────────────────');
  const { count: sc, error: se } = await sb
    .from('pet_swipes')
    .select('*', { count: 'exact', head: true });
  if (se) console.error('pet_swipes:', se.message);
  else console.log(`  rows: ${sc}`);

  console.log('\n── pet_matches row count ────────────────────');
  const { count: mc, error: me } = await sb
    .from('pet_matches')
    .select('*', { count: 'exact', head: true });
  if (me) console.error('pet_matches:', me.message);
  else console.log(`  rows: ${mc}`);

  console.log('\n── pet_names sample (first 3 rows) ─────────');
  const { data, error: de } = await sb
    .from('pet_names')
    .select('slug, pet_type, name, origin')
    .limit(3);
  if (de) console.error(de.message);
  else console.log(JSON.stringify(data, null, 2));

  console.log('\n── RLS policies on pet_names ────────────────');
  const { data: rls, error: re } = await sb
    .rpc('get_policies_for_table', { p_table: 'pet_names' })
    .select('*');
  if (re) {
    // Try direct pg query if rpc not available
    const { data: pg, error: pe } = await sb
      .from('pg_policies')
      .select('policyname, permissive, roles, cmd, qual')
      .eq('tablename', 'pet_names');
    if (pe) console.log('  (RLS check via rpc unavailable —', re.message, ')');
    else console.log(JSON.stringify(pg, null, 2));
  } else {
    console.log(JSON.stringify(rls, null, 2));
  }
}

run().catch(console.error);
