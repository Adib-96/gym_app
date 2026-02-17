import { createClient } from '@supabase/supabase-js'

function createServerSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )
}

const supabase =  createServerSupabase()

export default supabase