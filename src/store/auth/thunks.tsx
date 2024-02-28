import { handleLogin, handleLogout } from "./provider";
import { login, logout } from "./authSlice";
import { AppDispatch } from "../store";

export const checkingAuth = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    const { error, session, user } = await handleLogin(email, password);

    if (error || !session)
      return dispatch(logout({ errorMessage: error?.message, error: true }));

    return dispatch(login({ session, user }));
  };
};

export const singout = () => {
  return async (dispatch: AppDispatch) => {
    const logoutSuccess = await handleLogout();
    if (logoutSuccess)
      return dispatch(logout({ errorMessage: "logout", error: false }));
  };
};
