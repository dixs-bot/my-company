import { supabase } from "./supabase";

export function convertEmployeeIdToEmail(
  employeeId: string
): string {
  const sanitized = employeeId.trim().toLowerCase();

  if (sanitized.includes("@")) {
    return sanitized;
  }

  return `${sanitized}@mycompanyerp.internal`;
}

export interface AuthUser {
  id: string;
  employeeId: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function signInWithEmployeeId(
  employeeId: string,
  password: string
): Promise<AuthResponse> {
  const email =
    convertEmployeeIdToEmail(employeeId);

  // ==========================
  // DEMO MODE
  // ==========================
  if (!isSupabaseConfigured()) {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    const emp =
      employeeId.trim().toUpperCase();

    if (
      (emp === "ADMIN" ||
        emp === "EMP100") &&
      password === "password123"
    ) {
      return {
        success: true,
        user: {
          id: "demo-admin",
          employeeId: emp,
          email,
          fullName:
            "System Administrator",
          role: "super_admin",
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
          role: "employee",
          department: "General",
        },
      };
    }

    return {
      success: false,
      error:
        "Invalid Employee ID or Password.",
    };
  }

  // ==========================
  // REAL LOGIN
  // ==========================
  try {
    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    if (
      authError ||
      !authData.user
    ) {
      return {
        success: false,
        error:
          authError?.message ||
          "Login failed.",
      };
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("employees")
      .select(
        `
          id,
          employee_id,
          full_name,
          email,
          role,
          departments(name)
        `
      )
      .eq(
        "auth_user_id",
        authData.user.id
      )
      .single();

    if (
      profileError ||
      !profile
    ) {
      return {
        success: false,
        error:
          "Employee profile not found.",
      };
    }

    return {
      success: true,
      user: {
        id: profile.id,
        employeeId:
          profile.employee_id,
        email: profile.email,
        fullName:
          profile.full_name,
        role: profile.role,
        department:
          (
            profile as any
          ).departments?.name ??
          "General",
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error:
        err?.message ||
        "An unexpected error occurred.",
    };
  }
}

export async function signOut(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const { error } =
    await supabase.auth.signOut();

  return !error;
}
