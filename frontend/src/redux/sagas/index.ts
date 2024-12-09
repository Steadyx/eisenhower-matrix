import { all, fork } from "redux-saga/effects";
import authSagas from "@redux/sagas/auth/authSaga"
import taskSagas from "@redux/sagas/task/taskSagas";

export default function* rootSaga() {
  yield all([
    fork(authSagas),
    fork(taskSagas),
  ]);
}
