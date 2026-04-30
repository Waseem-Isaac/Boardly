/**
 * Reusable task card displaying task details with status, priority, and actions.
 * DUMB component (presentational, receives task via input)
 */
import { Component, inject, input, output } from '@angular/core';
import { Task } from '../../models';
import { DueDatePipe } from '../../../../../shared/pipes/due-date.pipe';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import { UsersService } from '../../../users/users.service';

@Component({
  selector: 'app-task-card',
  imports: [DueDatePipe, NgClass, MatIconModule, MatMenuModule, MatIconButton],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  deleteRequested = output<string>();
  editRequested = output<string>();
  task = input.required<Task>();
  usersService = inject(UsersService);

  isOverdue(task: Task): boolean {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'done';
  }
}
