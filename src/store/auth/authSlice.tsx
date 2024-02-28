import { createSlice } from "@reduxjs/toolkit";
import { Session } from "@supabase/supabase-js";

export type AuthSliceState = {
  logged: boolean;
  token: string | null;
  uid: string | null;
  email: string | null;
  checking: boolean;
  errorMessage: string | null;
  session: Session | null;
  user: any | null;
};

const initialState: AuthSliceState = {
  logged: false,
  token: null,
  uid: null,
  email: null,
  checking: false,
  errorMessage: null,
  session: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      const session = payload.session as Session;
      const user = payload.user;

      state.logged = true;
      state.uid = session.user.id;
      state.token = session.access_token;
      state.email = session.user.email ?? null;
      state.checking = false;
      state.errorMessage = null;
      state.session = session;
      state.user = user;
    },
    logout: (state, { payload }) => {
      state.logged = false;
      state.uid = null;
      state.token = null;
      state.email = null;
      state.checking = false;
      state.errorMessage = payload?.errorMessage;
      state.session = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
