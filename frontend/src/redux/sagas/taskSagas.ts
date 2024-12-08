// src/redux/sagas/taskSagas.ts
import { takeLatest, call, put, select, all, fork } from "redux-saga/effects";
import axios, { AxiosResponse } from "axios";
import {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  createTaskRequest,
  createTaskSuccess,
  createTaskFailure,
  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskFailure,
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

const updateTaskApi = (
  id: string,
  updates: Partial<{ title: string; completed: boolean; quadrantId: string }>,
  token: string
): Promise<AxiosResponse<TaskResponse>> =>
  axios.put<TaskResponse>(`${API_URL}/tasks/${id}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });

const deleteTaskApi = (id: string, token: string): Promise<AxiosResponse<void>> =>
  axios.delete<void>(`${API_URL}/tasks/${id}`, {
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

function* handleUpdateTask(action: PayloadAction<{ id: string; updates: Partial<TaskResponse> }>): SagaIterator {
  try {
    const { id, updates } = action.payload;
    const token: string | null = yield select((state: RootState) => state.auth.token);

    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const response: AxiosResponse<TaskResponse> = yield call(updateTaskApi, id, updates, token);
    yield put(updateTaskSuccess(response.data));
  } catch (error: unknown) {
    let errorMessage: string;

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.error || "Failed to update task.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "Failed to update task.";
    }

    yield put(updateTaskFailure(errorMessage));
  }
}

function* handleDeleteTask(action: PayloadAction<string>): SagaIterator {
  try {
    const id = action.payload;
    const token: string | null = yield select((state: RootState) => state.auth.token);

    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    yield call(deleteTaskApi, id, token);
    yield put(deleteTaskSuccess(id));
  } catch (error: unknown) {
    let errorMessage: string;

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.error || "Failed to delete task.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "Failed to delete task.";
    }

    yield put(deleteTaskFailure(errorMessage));
  }
}

function* watchFetchTasks(): SagaIterator {
  yield takeLatest(fetchTasksRequest.type, handleFetchTasks);
}

function* watchCreateTask(): SagaIterator {
  yield takeLatest(createTaskRequest.type, handleCreateTask);
}

function* watchUpdateTask(): SagaIterator {
  yield takeLatest(updateTaskRequest.type, handleUpdateTask);
}

function* watchDeleteTask(): SagaIterator {
  yield takeLatest(deleteTaskRequest.type, handleDeleteTask);
}

export default function* taskSagas(): SagaIterator {
  yield all([
    fork(watchFetchTasks),
    fork(watchCreateTask),
    fork(watchUpdateTask),
    fork(watchDeleteTask),
  ]);
}
