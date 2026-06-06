/**
 * Utility to map standard employee IDs (e.g. EMP001) 
 * to secure internal email identifiers for Supabase Auth.
 */
export function convertEmployeeIdToEmail(employeeId: string): string {
  const sanitized = employeeId.trim().toLowerCase();
  return `${sanitized}@mycompanyerp.internal`;
}

/**
 * Utility to extract Employee ID from system email strings.
 */
export function convertEmailToEmployeeId(email: string): string {
  return email.split('@')[0].toUpperCase();
}
