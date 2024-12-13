import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}
const initialState: AuthState = {
  token: localStorage.getItem("token"),
  username: localStorage.getItem("username"),
  loading: false,
  error: null,
};

export const registerRequest = createAction<string>("auth/registerRequest");
export const registerSuccess = createAction<{ token: string; username: string }>("auth/registerSuccess");
export const registerFailure = createAction<string>("auth/registerFailure");

export const loginRequest = createAction<string>("auth/loginRequest");
export const loginSuccess = createAction<{ token: string; username: string }>("auth/loginSuccess");
export const loginFailure = createAction<string>("auth/loginFailure");

export const logout = createAction("auth/logout");

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerRequest, (state, _action: PayloadAction<string>) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerSuccess, (state, action: PayloadAction<{ token: string; username: string }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.username = action.payload.username;
      })
      .addCase(registerFailure, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginRequest, (state, _action: PayloadAction<string>) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginSuccess, (state, action: PayloadAction<{ token: string; username: string }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.username = action.payload.username;
      })
      .addCase(loginFailure, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logout, (state) => {
        state.token = null;
        state.username = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
