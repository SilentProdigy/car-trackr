import { supabase } from "./supabase";

export async function getMFAStatus() {
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (error) {
    throw error;
  }

  return {
    currentLevel: data.currentLevel,
    nextLevel: data.nextLevel,
    hasMFA: data.nextLevel === "aal2",
    isVerifiedWithMFA: data.currentLevel === "aal2",
  };
}