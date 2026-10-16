/**
 * Database client bridge - resilient multi-mode backend.
 * Uses in-memory database for ultra-fast, self-contained demonstration and serverless environments,
 * or bridges to Supabase if valid custom SUPABASE_URL and SUPABASE_SECRET_KEY are configured.
 */
import { memoryDb } from './memoryDb';
import { db as supabaseDb } from './supabaseDb';

const hasValidSupabase =
  Boolean(process.env.SUPABASE_URL) &&
  !process.env.SUPABASE_URL?.includes('hccipfppmebfcozvcymc') &&
  Boolean(process.env.SUPABASE_SECRET_KEY) &&
  !process.env.SUPABASE_SECRET_KEY?.includes('••••');

export const db: any = hasValidSupabase ? supabaseDb : memoryDb;
export const prisma: any = db;
export default db;
