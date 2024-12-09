// src/controllers/taskController.ts
import { Request, Response } from "express";
import * as taskService from "@services/taskService";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const tasks = await taskService.getAllTasksByUser(userId);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getTasks:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const addTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, quadrantId } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const task = await taskService.createTask(title, quadrantId, userId);
    res.status(201).json(task);
  } catch (error) {
    console.error("Error in addTask:", error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const task = await taskService.updateTask(id, updates, userId);
    if (!task) {
      res.status(404).json({ error: 'Task not found or not authorized' });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error in updateTask:", error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const task = await taskService.deleteTask(id, userId);
    if (!task) {
      res.status(404).json({ error: 'Task not found or not authorized' });
      return;
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("Error in deleteTask:", error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};
