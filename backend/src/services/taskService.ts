// src/services/taskService.ts
import Task, { ITask } from "@models/Task";

export const getAllTasksByUser = async (userId: string): Promise<ITask[]> => {
  console.log("Fetching tasks for user:", userId);
  return Task.find({ user: userId }).sort({ createdAt: -1 });
};

export const createTask = async (title: string, quadrantId: string, userId: string): Promise<ITask> => {
  console.log("Creating task with title:", title, "quadrantId:", quadrantId, "userId:", userId);
  const task = new Task({ title, quadrantId, user: userId });
  const savedTask = await task.save();
  console.log("Saved task:", savedTask);
  return savedTask;
};

export const updateTask = async (id: string, updates: Partial<ITask>, userId: string): Promise<ITask | null> => {
  console.log("Updating task:", id, "with updates:", updates, "for user:", userId);
  return Task.findOneAndUpdate({ _id: id, user: userId }, updates, { new: true });
};

export const deleteTask = async (id: string, userId: string): Promise<ITask | null> => {
  console.log("Deleting task:", id, "for user:", userId);
  return Task.findOneAndDelete({ _id: id, user: userId });
};
