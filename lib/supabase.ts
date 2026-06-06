import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rcdtppxxagtqjtacklrz.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZHRwcHh4YWd0cWp0YWNrbHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTM3MjQsImV4cCI6MjA5NjMyOTcyNH0.7PjvbsB1KSYmFLa4_0q80VvFAAD436nT4LsQRbiMq2M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
