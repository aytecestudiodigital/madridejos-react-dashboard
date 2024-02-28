import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
import { Database } from "./supabaseTypes";
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
