import { supabase } from "./supabase";

export function convertEmployeeIdToEmail(employeeId: string): string {
  const sanitized = employeeId.trim().toLowerCase();

  if (sanitized.includes("@")) {
    return sanitized;
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

// Check if Supabase ENV exists
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function signInWithEmployeeId(
  employeeId: string,
  password: string
): Promise<AuthResponse> {

  const email = convertEmployeeIdToEmail(employeeId);

  // DEMO MODE
  if (!isSupabaseConfigured()) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const emp = employeeId.trim().toUpperCase();

    if (
      (emp === "ADMIN" || emp === "EMP100") &&
      password === "password123"
    ) {
      return {
        success: true,
        user: {
          id: "demo-admin",
          employeeId: emp,
          email,
          fullName: "Administrator",
          role: "Super Admin",
          department: "Management",
        },
      };
    }

    if (password.length >= 6) {
      return {
        success: true,
        user: {
          id: crypto.randomUUID(),
          employeeId: emp,
          email,
          fullName: `Employee ${emp}`,
          role: "Staff",
          department: "Operations",
        },
      };
    }

    return {
      success: false,
      error: "Employee ID atau Password salah.",
    };
  }

  // REAL SUPABASE LOGIN
  try {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        employeeId: employeeId.toUpperCase(),
        email: data.user.email || email,
        fullName:
          data.user.user_metadata?.full_name ??
          "Corporate Employee",
        role:
          data.user.user_metadata?.role ??
          "Employee",
        department:
          data.user.user_metadata?.department ??
          "General",
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error:
        err?.message ||
        "Terjadi kesalahan saat login.",
    };
  }
}

export async function signOut(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const { error } = await supabase.auth.signOut();

  return !error;
}
