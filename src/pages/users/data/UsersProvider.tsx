import { supabase } from "../../../server/supabase";
import { AymoUser } from "../models/AymoUser";

export const newUser = async (user: any) => {
  try {
    const tableName = import.meta.env.VITE_TABLE_USERS;

    //creamos las credenciales
    const { data: SBUser, error: SBError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });
    if (SBError) return null;

    delete user.password;

    const newUser = {
      ...user,
      uid: SBUser.user?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(tableName)
      .insert(newUser)
      .select();

    if (error) return null;

    return data[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteUser = async (user: AymoUser) => {
  const tableName = import.meta.env.VITE_TABLE_USERS;

  if (user.uid) {
    const fbEndpoint: string = import.meta.env.VITE_FIREBASE_URL;
    fetch(`${fbEndpoint}/auth/users/delete/${user.id}`, {
      method: "DELETE",
      headers: {
        "Authorization-Token": import.meta.env.VITE_FIREBASE_AUTH_TOKEN,
      },
    }).then((response) => console.log(response));
  } else {
    const error = await supabase.from(tableName).delete().eq("id", user.id!);

    console.log(error);
    return error;
  }
};

export const resetPasswordByEmail = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  console.log(error);
  console.log(data);
};
