import axios from "axios";
import { AxiosResponse } from "axios";
import { TaskResponse } from "@redux/sagas/task/taskTypes";
import axiosInstance from "@api/axiosInstance"

export const fetchTasksApi = (token: string): Promise<AxiosResponse<TaskResponse[]>> =>
  axiosInstance(token).get<TaskResponse[]>("/tasks");

export const createTaskApi = (
  task: { title: string; quadrantId: string },
  token: string
): Promise<AxiosResponse<TaskResponse>> =>
  axiosInstance(token).post<TaskResponse>("/tasks", task);

export const updateTaskApi = (
  id: string,
  updates: Partial<{ title: string; completed: boolean; quadrantId: string }>,
  token: string
): Promise<AxiosResponse<TaskResponse>> =>
  axiosInstance(token).put<TaskResponse>(`/tasks/${id}`, updates);

export const deleteTaskApi = async (id: string, token: string): Promise<void> => {
  try {
    await axiosInstance(token).delete(`/tasks/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn(`Task with ID ${id} not found (404). Skipping.`);
      return;
    }
    throw error;
  }
};
