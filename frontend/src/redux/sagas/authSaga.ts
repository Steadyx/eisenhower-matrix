import { takeLatest, call, put, all, fork } from "redux-saga/effects";
import axios, { AxiosResponse } from "axios";
import {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
} from "../slices/authSlice";
import { SagaIterator } from "redux-saga";
import { PayloadAction } from "@reduxjs/toolkit";

const API_URL = "http://localhost:4000";

interface AuthResponse {
  token: string;
  username: string;
}

const registerApi = (uniqueID: string): Promise<AxiosResponse<AuthResponse>> =>
  axios.post<AuthResponse>(`${API_URL}/register`, { uniqueID });

const loginApi = (uniqueID: string): Promise<AxiosResponse<AuthResponse>> =>
  axios.post<AuthResponse>(`${API_URL}/login`, { uniqueID });

function* handleRegister(action: PayloadAction<string>): SagaIterator {
  try {
    const uniqueID: string = action.payload;
    const response: AxiosResponse<AuthResponse> = yield call(registerApi, uniqueID);
    const { token, username } = response.data;

    if (!token || !username) {
      throw new Error("Invalid response from server");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);

    yield put(registerSuccess({ token, username }));
  } catch (error: unknown) {
    let errorMessage: string;

    if (axios.isAxiosError(error)) {

      errorMessage = error.response?.data?.error || "Registration failed";
    } else if (error instanceof Error) {

      errorMessage = error.message;
    } else {

      errorMessage = "Registration failed";
    }

    yield put(registerFailure(errorMessage));
  }
}

function* handleLogin(action: PayloadAction<string>): SagaIterator {
  try {
    const uniqueID: string = action.payload;
    const response: AxiosResponse<AuthResponse> = yield call(loginApi, uniqueID);
    const { token, username } = response.data;

    if (!token || !username) {
      throw new Error("Invalid response from server");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);

    yield put(loginSuccess({ token, username }));
  } catch (error: unknown) {
    let errorMessage: string;

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.error || "Login failed";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "Login failed";
    }

    yield put(loginFailure(errorMessage));
  }
}

function* watchRegister() {
  yield takeLatest(registerRequest.type, handleRegister);
}

function* watchLogin() {
  yield takeLatest(loginRequest.type, handleLogin);
}

export default function* authSagas() {
  yield all([fork(watchRegister), fork(watchLogin)]);
}
