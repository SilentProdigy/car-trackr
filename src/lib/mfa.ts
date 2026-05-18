import { supabase } from "./supabase";

export async function enrollMFA() {
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function verifyMFAEnrollment(factorId: string, code: string) {
  const { data, error } = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function listMFAFactors() {
  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) {
    throw error;
  }

  return data;
}

export async function unenrollMFA(factorId: string) {
  const { data, error } = await supabase.auth.mfa.unenroll({
    factorId,
  });

  if (error) {
    throw error;
  }

  return data;
}