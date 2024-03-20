import { supabase } from "../../../server/supabase";
import {
  getOneRow,
  insertRow,
  updateRow,
} from "../../../server/supabaseQueries";
import { encrypt } from "../../../utils/utils";
import { AymoUser } from "../models/AymoUser";
import axios from "axios";

const token = import.meta.env.VITE_FIREBASE_AUTH_TOKEN;
const firebaseAuth = import.meta.env.VITE_FIREBASE_AUTH_TOKEN;

export const newUser = async (user: any, groups: any) => {
  try {
    const tableName = import.meta.env.VITE_TABLE_USERS;
    const userActive = JSON.parse(localStorage.getItem("userLogged")!);

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

    if (data) {
      if (groups.length > 0) {
        for await (const group of groups) {
          const newGroup = {
            user_id: data[0].id,
            group_id: group,
            created_by: userActive.id,
            updated_by: userActive.id,
          };
          await insertRow(newGroup, "users_groups");
        }
      }
    }

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
        "Authorization-Token": token,
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
  if (data) {
    return 200;
  } else if (error) {
    return 500;
  }
};

export const verificationEmail = async (email: string) => {
  const dataUser = JSON.stringify({
    email: email,
  });
  const bodyRegister = await encrypt(dataUser);
  const bodyRegisterJSON = JSON.stringify(bodyRegister);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://europe-west2-aymo-tomelloso.cloudfunctions.net/auth/resend-verification",
    headers: {
      "Authorization-Token": `${firebaseAuth}`,
      "Content-Type": "application/json",
    },
    data: bodyRegisterJSON,
  };

  axios
    .request(config)
    .then((response) => {
      return response.status;
    })
    .catch((error) => {
      console.log(error.status);
      return error.status;
    });
};

export const updateUser = async (data: any) => {
  try {
    const tableName = import.meta.env.VITE_TABLE_USERS;
    const session = await supabase.auth.getSession();
    console.log("session: ", session);
    const userToUpdate = (await getOneRow(
      "id",
      data.id,
      tableName,
    )) as AymoUser;
    if (
      userToUpdate.email !== data.email ||
      userToUpdate.phone !== data.phone
    ) {
      let config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `https://europe-west2-aymo-madridejos.cloudfunctions.net/auth/${
          session.data.session!.user.id
        }?email=${data.email}&phone=${data.phone}`,
        headers: {
          "Authorization-Token": "EOjPiyCShLYX1PC4Jj9an0tJ0WKhDZ",
          "User-Token": session.data.session!.access_token,
        },
      };

      axios
        .request(config)
        .then((response) => {
          return response.data as AymoUser;
        })
        .catch((error) => {
          return error.status;
        });
    }
    return (await updateRow(data, tableName)) as AymoUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};
