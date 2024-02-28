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
    supabase
      .from(tableName)
      .select("*, users_roles!users_role_fkey(*)")
      .eq("uid", session.user.id)
      .then((userDb) => {
        if (userDb) {
          user = userDb.data![0];
          localStorage.setItem("userLogged", JSON.stringify(user));
        }
      });
  }

  return {
    error,
    session,
    user,
  };
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
