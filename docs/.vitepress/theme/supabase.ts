import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://xvutphcywkxtvurrajlp.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_a4Oc1QVjIM6-XnQgd4N4nA_erhDCWSa'

export const supabase = createClient(url, key)
