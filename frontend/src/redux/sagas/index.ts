// src/redux/sagas/index.ts
import { all } from "redux-saga/effects";
import authSagas from "./authSaga";
import taskSagas from "./taskSagas";

export default function* rootSaga() {
  yield all([
    authSagas(),
    taskSagas(),
  ]);
}
