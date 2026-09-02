import { supabase } from './supabase';

/**
 * Verifies the current Supabase session and admin role.
 * Returns { session, profile, isAdmin, error }
 * Use this before any admin INSERT/UPDATE/DELETE to detect auth problems early.
 */
export async function getAdminSession() {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      return { session: null, profile: null, isAdmin: false, error: sessionError.message };
    }

    if (!session) {
      return { session: null, profile: null, isAdmin: false, error: 'No active session. Please log in again.' };
    }

    // Verify role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, full_name')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      return {
        session,
        profile: null,
        isAdmin: false,
        error: `Profile fetch error: ${profileError.message}. Your user profile may not exist in public.profiles.`
      };
    }

    if (!profile) {
      return {
        session,
        profile: null,
        isAdmin: false,
        error: `No profile row found for user ${session.user.email}. The on_auth_user_created trigger may not have fired.`
      };
    }

    if (profile.role !== 'admin') {
      return {
        session,
        profile,
        isAdmin: false,
        error: `Your account role is "${profile.role}", not "admin". Go to Supabase Dashboard → Table Editor → profiles → update role to "admin" for user ID: ${session.user.id}`
      };
    }

    return { session, profile, isAdmin: true, error: null };
  } catch (err) {
    return { session: null, profile: null, isAdmin: false, error: err.message };
  }
}

/**
 * Returns a descriptive error message for Supabase RLS violations.
 * Maps generic RLS error codes into actionable messages.
 */
export function interpretSupabaseError(error) {
  if (!error) return null;

  const code = error.code;
  const message = error.message || '';
  const hint = error.hint || '';

  // RLS violation
  if (code === '42501' || message.includes('row-level security') || message.includes('violates row-level security policy')) {
    return `RLS Policy Violation: Your Supabase account does not have admin privileges. \n\nTo fix: Go to Supabase Dashboard → SQL Editor and run:\n\nUPDATE public.profiles SET role = 'admin' WHERE id = auth.uid();\n\nThen sign out and sign back in.`;
  }

  // Not authenticated
  if (code === 'PGRST301' || message.includes('JWT') || message.includes('not authenticated')) {
    return `Authentication Error: Your session has expired or is invalid. Please sign out and sign back in.`;
  }

  // No rows (expected sometimes)
  if (code === 'PGRST116') {
    return null; // Normal case, no row found
  }

  // Unique constraint
  if (code === '23505') {
    return `Duplicate Error: A record with this name/value already exists. ${hint}`;
  }

  // Foreign key
  if (code === '23503') {
    return `Constraint Error: This operation is blocked because related records exist. ${hint}`;
  }

  // Check constraint
  if (code === '23514') {
    return `Invalid Value: The data you entered violates a database constraint. ${hint}`;
  }

  return message || 'An unexpected database error occurred.';
}
