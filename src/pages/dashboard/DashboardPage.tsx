import { Outlet, useNavigate } from "react-router-dom";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { useEffect } from "react";
import { supabase } from "../../server/supabase";
import { login, logout } from "../../store/auth/authSlice";
import { useDispatch } from "react-redux";

export default function DashboardPage() {
  //const tableName = import.meta.env.VITE_TABLE_USERS;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //const user = JSON.parse(localStorage.getItem("userLogged")!);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        localStorage.setItem("accessToken", session.access_token);
        /* getOneRow("uid", session.user.id, tableName).then((user) => {
          dispatch(login({ session, user }));
        }); */
        supabase
          .from("users")
          .select("*, users_roles!users_role_fkey(*)")
          .eq("uid", session.user.id)
          .then((userDb) => {
            if (userDb && userDb.data) {
              const user = userDb.data![0];
              localStorage.setItem("userLogged", JSON.stringify(user));
              dispatch(login({ session, user }));
            }
          });
      } else {
        dispatch(logout({}));
        navigate("/login");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        localStorage.setItem("accessToken", session.access_token);
        supabase
          .from("users")
          .select("*, users_roles!users_role_fkey(*)")
          .eq("uid", session.user.id)
          .then((userDb) => {
            if (userDb && userDb.data) {
              const user = userDb.data![0];
              localStorage.setItem("userLogged", JSON.stringify(user));
              dispatch(login({ session, user }));
            }
          });
      } else {
        dispatch(logout({}));
        navigate("/login");
      }
    });

    /* supabase
      .channel("table_db_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users_roles",
        },
        (payload: any) => {
          if (payload.new.id === user.role) {
            window.location.reload();
          }
        },
      )
      .subscribe(); */

    return () => subscription.unsubscribe();
  });

  return (
    <NavbarSidebarLayout>
      <Outlet />
    </NavbarSidebarLayout>
  );
}
