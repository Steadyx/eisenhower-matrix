import { takeLatest, call, put, select, all, fork } from "redux-saga/effects";
import axios, { AxiosResponse } from "axios";
import {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  createTaskRequest,
  createTaskSuccess,
  createTaskFailure,
} from "../slices/taskSlice";
import { RootState } from "../store";
import { SagaIterator } from "redux-saga";
import { PayloadAction } from "@reduxjs/toolkit";

const API_URL = "http://localhost:4000";

interface TaskResponse {
  id: string;
  title: string;
  completed: boolean;
  quadrantId: string;
}

const fetchTasksApi = (token: string): Promise<AxiosResponse<TaskResponse[]>> =>
  axios.get<TaskResponse[]>(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

const createTaskApi = (
  task: { title: string; quadrantId: string },
  token: string
): Promise<AxiosResponse<TaskResponse>> =>
  axios.post<TaskResponse>(`${API_URL}/tasks`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });

function* handleFetchTasks(): SagaIterator {
  try {
    const token: string | null = yield select((state: RootState) => state.auth.token);

    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response: AxiosResponse<TaskResponse[]> = yield call(fetchTasksApi, token);
    yield put(fetchTasksSuccess(response.data));
  } catch (error: unknown) {
    let errorMessage: string;

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.error || "Failed to fetch tasks.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "Failed to fetch tasks.";
    }

    yield put(fetchTasksFailure(errorMessage));
  }
}

function* handleCreateTask(action: PayloadAction<{ title: string; quadrantId: string }>): SagaIterator {
  try {
    const { title, quadrantId } = action.payload;
    const token: string | null = yield select((state: RootState) => state.auth.token);

    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response: AxiosResponse<TaskResponse> = yield call(createTaskApi, { title, quadrantId }, token);
    yield put(createTaskSuccess(response.data));
  } catch (error: unknown) {
    let errorMessage: string;

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.error || "Failed to create task.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "Failed to create task.";
    }

    yield put(createTaskFailure(errorMessage));
  }
}

function* watchFetchTasks(): SagaIterator {
  yield takeLatest(fetchTasksRequest.type, handleFetchTasks);
}

function* watchCreateTask(): SagaIterator {
  yield takeLatest(createTaskRequest.type, handleCreateTask);
}

export default function* taskSagas(): SagaIterator {
  yield all([fork(watchFetchTasks), fork(watchCreateTask)]);
}
