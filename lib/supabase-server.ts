import { createClient } from '@supabase/supabase-js'

function createServerSupabase() {
  return createClient(
    process.env.SUPABASE_DB_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'placeholder'
  )
}

const supabase = createServerSupabase()

export default supabase