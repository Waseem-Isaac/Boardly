/**
 * Team members view displaying user avatars and task assignments.
 * SMART component (loads data via TaskService)
 */
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UsersService } from './users.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UserAddComponent } from './user-add/user-add.component';
import { Confirmable } from '../../../shared/decorators/confirmable.decorator';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-users',
  imports: [MatIcon, MatIconButton, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  protected usersService = inject(UsersService);
  private dialog = inject(MatDialog);

  protected searchTerm = signal('');
  authService = inject(AuthService);

  private matchesSearch(name: string): boolean {
    const q = this.searchTerm().toLowerCase().trim();
    return !q || name.toLowerCase().includes(q);
  }

  protected activeUsers = computed(() =>
    this.usersService.users().filter((u) => u.active !== false && this.matchesSearch(u.name)),
  );
  protected inactiveUsers = computed(() =>
    this.usersService.users().filter((u) => u.active === false && this.matchesSearch(u.name)),
  );

  ngOnInit(): void {
    this.usersService.loadUsers();
  }

  openAddUserDialog(): void {
    this.dialog.open(UserAddComponent, { panelClass: 'task-dialog', disableClose: true });
  }

  @Confirmable({
    title: 'Delete Member',
    message: 'Are you sure you want to remove this team member?',
  })
  deleteUser(id: string): void {
    this.usersService.deleteUser(id).subscribe();
  }
}
