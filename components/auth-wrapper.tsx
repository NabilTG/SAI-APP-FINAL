import { createClient } from "@/utils/supabase/server";
import AuthClient from "./header-auth";


export default async function AuthWrapper() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return <AuthClient user={user} />;
}
