import { supabase } from "../../server/supabase";

export const handleLogin = async (email: string, password: string) => {
  const tableName = import.meta.env.VITE_TABLE_USERS;

  const {
    data: { session },
    error,
  } = await supabase.auth.signInWithPassword({ email, password });

  let user: any | null = null;
  if (session) {
    localStorage.setItem("accessToken", session.access_token);
    const userDb = await supabase
      .from(tableName)
      .select("*, users_roles!users_role_fkey(*)")
      .eq("uid", session.user.id)
    if (userDb) {
      user = userDb.data![0];
      localStorage.setItem("userLogged", JSON.stringify(user));
    }
  }

  if (user === null || (user && !user.users_roles)) {
    return {
      error
    }
  } else {
    return {
      error,
      session,
      user,
    };
  }
};

export const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
    return false;
  }

  localStorage.removeItem("accessToken");

  return true;
};
