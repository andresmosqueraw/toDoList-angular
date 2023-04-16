import { Injectable } from '@angular/core';
import { Task } from './task-list/task-list.component';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  addTask(task: Task) {
    const tasks = this.getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  deleteTask(index: number) {
    const tasks = this.getTasks();
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  updateTask(index: number, task: Task) {
    const tasks = this.getTasks();
    tasks[index] = task;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  getTasks(): Task[] {
    const tasksString = localStorage.getItem('tasks');
    return tasksString ? JSON.parse(tasksString) : [];
  }

  calculateStatistics(): { total: number; completed: number; } {
    const tasks = this.getTasks();
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    return { total, completed };
  }
  
}
