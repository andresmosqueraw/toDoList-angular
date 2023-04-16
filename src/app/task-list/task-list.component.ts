import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';

// El interface deberia ir en un archivo aparte. Llamariamos al archivo como task.model
export interface Task {
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})

export class TaskListComponent implements OnInit {
  todoList: Task[] = [];
  newTask: Task = { title: '', completed: false };
  filter: string = 'todas';
  editIndex: number = -1;
  editTaskTitle: string = '';
  totalTasks: number = 0;
  completedTasks: number = 0;

  constructor(private taskService: TaskService) {
    this.todoList = this.taskService.getTasks();
  }

  ngOnInit(): void {
    this.todoList = this.taskService.getTasks();
    // Carga las tareas desde algún lugar y actualiza las propiedades de totalTasks y completedTasks
    this.totalTasks = this.todoList.length;
    this.completedTasks = this.todoList.filter(task => task.completed).length;
  }

  addTask() {
    this.taskService.addTask(this.newTask);
    this.newTask = { title: '', completed: false };
    this.todoList = this.taskService.getTasks();
    this.updateStatistics();
  }

  deleteTask(index: number) {
    this.taskService.deleteTask(index);
    this.todoList = this.taskService.getTasks();
    this.updateStatistics();
  }

  updateTask(index: number, task: Task) {
    this.taskService.updateTask(index, task);
    this.todoList = this.taskService.getTasks();
  }

  editTask(index: number) {
    this.editIndex = index;
    this.editTaskTitle = this.todoList[index].title;
  }

  saveTask(status: boolean) {
    const updatedTask: Task = { title: this.editTaskTitle, completed: status };
    this.updateTask(this.editIndex, updatedTask);
    this.editIndex = -1;
    this.editTaskTitle = '';
    this.todoList = this.taskService.getTasks();
    this.updateStatistics();
  }

  checkTask(index: number, status: boolean) {
    const task: Task = { title: this.todoList[index].title, completed: status };
    if(task.completed == true){
      task.completed = false;
    }
    else{
      task.completed = true;
    }
    this.taskService.updateTask(index, task);
    this.todoList = this.taskService.getTasks();
    this.updateStatistics();
  }

  private updateStatistics() {
    const { total, completed } = this.taskService.calculateStatistics();
    this.totalTasks = total;
    this.completedTasks = completed;
  }
  
  // Modifica la función filterTasks para actualizar el filtro seleccionado
  filterTasks(status: 'completadas' | 'pendientes' | 'todas') {
    // Actualiza el estado del filtro seleccionado
    this.filter = status;

    // Crea una copia de la lista original
    const originalList = this.taskService.getTasks();

    if (status === 'todas') {
      this.todoList = originalList;
    }
    else if (status === 'completadas') {
      this.todoList = originalList.filter(task => task.completed);
    } else if (status === 'pendientes') {
      this.todoList = originalList.filter(task => !task.completed);
    }
  }
}
