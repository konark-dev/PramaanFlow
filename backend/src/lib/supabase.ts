import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || '';

// Client initialized with SUPABASE_SECRET_KEY for full database admin operations if configured
export const supabase = (supabaseUrl && supabaseSecretKey && !supabaseUrl.includes('hccipfppmebfcozvcymc'))
  ? createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : ({} as any);
