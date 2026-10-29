import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hslleuuyfmaqpajjmwie.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbGxldXV5Zm1hcXBhamptd2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMTU1NTcsImV4cCI6MjEwODc5MTU1N30.ykz1okldVO7ooViqTAdp9ZJY0WtrbyKc0E0I50S6Yd4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

