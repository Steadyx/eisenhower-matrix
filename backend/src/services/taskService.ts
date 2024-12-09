// src/services/taskService.ts
import Task, { ITask } from "@models/Task";

export const getAllTasksByUser = async (userId: string): Promise<ITask[]> => {
  return Task.find({ user: userId }).sort({ createdAt: -1 });
};

export const createTask = async (title: string, quadrantId: string, userId: string): Promise<ITask> => {
  const task = new Task({ title, quadrantId, user: userId });
  const savedTask = await task.save();
  return savedTask;
};

export const updateTask = async (id: string, updates: Partial<ITask>, userId: string): Promise<ITask | null> => {
  return Task.findOneAndUpdate({ _id: id, user: userId }, updates, { new: true });
};

export const deleteTask = async (id: string, userId: string): Promise<ITask | null> => {
  return Task.findOneAndDelete({ _id: id, user: userId });
};
