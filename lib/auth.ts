import { supabase } from "./supabase";

/**
 * Converts a standard corporate Employee ID into a standard email-like login identifier
 * recognized by Supabase Auth (since Supabase requires an email address as standard).
 * E.g., "EMP2026101" -> "emp2026101@mycompanyerp.internal"
 */
export function convertEmployeeIdToEmail(employeeId: string): string {
  const sanitized = employeeId.trim().toLowerCase();
  if (sanitized.includes("@")) {
    return sanitized; // Already an email format
  }
  return `${sanitized}@mycompanyerp.internal`;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    employeeId: string;
    email: string;
    fullName: string;
    role: string;
    department: string;
  };
  error?: string;
}

/**
 * Perform login using Employee ID (converted to email) and Password.
 * Provides a highly reliable mock fallback when credentials are mock or when
 * Supabase environment variables are unconfigured. This ensures the premium UI
 * is instantly demo-able out-of-the-box.
 */
export async function signInWithEmployeeId(employeeId: string, password: string): Promise<AuthResponse> {
  const email = convertEmployeeIdToEmail(employeeId);

  // Check if Supabase keys are default/missing
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://rcdtppxxagtqjtacklrz.supabase.co" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZHRwcHh4YWd0cWp0YWNrbHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTM3MjQsImV4cCI6MjA5NjMyOTcyNH0.7PjvbsB1KSYmFLa4_0q80VvFAAD436nT4LsQRbiMq2M";

  if (!isSupabaseConfigured) {
    // Elegant simulation delay for realistic UX/UI state transitions
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Demo Credentials fallback
    const normEmpId = employeeId.trim().toUpperCase();
    if ((normEmpId === "EMP100" || normEmpId === "ADMIN") && password === "password123") {
      return {
        success: true,
        user: {
          id: "mock-uid-001",
          employeeId: normEmpId,
          email: email,
          fullName: "Alexander Sterling",
          role: "Chief Technology Officer",
          department: "Executive Management",
        },
      };
    } else if (password.length >= 6) {
      // Allow general demo-mode authentication for any employee ID if password is correct length
      return {
        success: true,
        user: {
          id: `mock-uid-${Math.random().toString(36).substr(2, 9)}`,
          employeeId: normEmpId,
          email: email,
          fullName: `Corporate User (${normEmpId})`,
          role: "Senior Operations Specialist",
          department: "Business Operations",
        },
      };
    } else {
      return {
        success: false,
        error: "Invalid password. For demo mode, try using Employee ID 'EMP100' with password 'password123' or enter any password of at least 6 characters.",
      };
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Retrieve metadata or parse username
    return {
      success: true,
      user: {
        id: data.user?.id || "unknown",
        employeeId: employeeId.trim().toUpperCase(),
        email: data.user?.email || email,
        fullName: data.user?.user_metadata?.full_name || "Corporate Employee",
        role: data.user?.user_metadata?.role || "Team Associate",
        department: data.user?.user_metadata?.department || "Operations",
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "An unexpected error occurred during corporate sign-in.",
    };
  }
}

/**
 * Handle sign out
 */
export async function signOut(): Promise<boolean> {
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "placeholder-anon-key";

  if (!isSupabaseConfigured) {
    return true;
  }

  const { error } = await supabase.auth.signOut();
  return !error;
}
