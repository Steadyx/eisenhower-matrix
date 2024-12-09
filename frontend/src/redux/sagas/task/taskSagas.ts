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
  deleteTaskFromQuadrantRequest,
  deleteTaskFromQuadrantSuccess,
  deleteTaskFromQuadrantFailure,
  clearAllTasksRequest,
  clearAllTasksSuccess,
  clearAllTasksFailure,
} from "@redux/slices/taskSlice";
import { RootState } from "@redux/store";
import { SagaIterator } from "redux-saga";
import { PayloadAction } from "@reduxjs/toolkit";
import { TaskResponse } from "@redux/sagas/task/taskTypes";
import { fetchTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } from "@redux/sagas/task/taskApi";

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

function* handleClearAllTasks(): SagaIterator {
  try {
    const token: string | null = yield select((state: RootState) => state.auth.token);
    const taskIds: string[] = yield select((state: RootState) => state.tasks.tasks.map((task) => task._id));

    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.");
    }

    yield all(taskIds.map((id) => call(deleteTaskApi, id, token)));

    yield put(clearAllTasksSuccess());
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred while clearing tasks.";

    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = error.response.data?.error || "Failed to clear all tasks.";
        console.error(`API Error [${error.response.status}]: ${errorMessage}`);
      } else if (error.request) {
        errorMessage = "No response from the server. Please check your network connection.";
        console.error("API Request Error: No response received.", error.request);
      } else {
        errorMessage = error.message || "An error occurred during the request.";
        console.error("API Setup Error:", error.message);
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    yield put(clearAllTasksFailure(errorMessage));
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

function* handleDeleteTasksFromQuadrant(action: PayloadAction<string>): SagaIterator {
  try {
    const quadrantId = action.payload;
    const token: string | null = yield select((state: RootState) => state.auth.token);

    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    const tasks: TaskResponse[] = yield select((state: RootState) => state.tasks.tasks);
    const ids = tasks.filter((task) => task.quadrantId === quadrantId).map((task) => task._id);

    if (ids.length === 0) {
      console.warn(`No tasks found in quadrant ${quadrantId}.`);
      return;
    }

    yield all(ids.map((id) => call(deleteTaskApi, id, token)));

    yield put(deleteTaskFromQuadrantSuccess(quadrantId));
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    yield put(deleteTaskFromQuadrantFailure(errorMessage));
  }
}

function* handleDeleteActiveTasks(action: PayloadAction<string[]>): SagaIterator {
  const ids = action.payload;

  try {
    const token: string | null = yield select((state: RootState) => state.auth.token);

    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    yield all(ids.map((id) => call(deleteTaskWithErrorHandling, id, token)));
  } catch (error) {
    yield put(deleteTaskFailure(getErrorMessage(error)));
  }
}

function* deleteTaskWithErrorHandling(id: string, token: string): SagaIterator {
  try {
    yield call(deleteTaskApi, id, token);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn(`Task with ID ${id} not found (404). Skipping.`);
    } else {
      throw error;
    }
  }
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || "Failed to delete tasks.";
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return "Failed to delete tasks.";
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

function* watchDeleteActiveTasks(): SagaIterator {
  yield takeLatest("tasks/deleteActiveTasks", handleDeleteActiveTasks);
}

export function* watchDeleteTasksFromQuadrant(): SagaIterator {
  yield takeLatest(deleteTaskFromQuadrantRequest.type, handleDeleteTasksFromQuadrant);
}

function* watchClearAllTasks(): SagaIterator {
  yield takeLatest(clearAllTasksRequest.type, handleClearAllTasks);
}

export default function* taskSagas(): SagaIterator {
  yield all([
    fork(watchFetchTasks),
    fork(watchCreateTask),
    fork(watchUpdateTask),
    fork(watchDeleteTask),
    fork(watchDeleteActiveTasks),
    fork(watchDeleteTasksFromQuadrant),
    fork(watchClearAllTasks),
  ]);
}
