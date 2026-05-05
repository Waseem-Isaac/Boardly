/**
 * Navigation menu component displaying app routes with icons.
 * SMART component (as it injects LayoutService for responsive behavior)
 */
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from '../../core/services/layout.service';
import { BoardAddComponent } from '../../features/board/components/board-add/board-add.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  protected layout = inject(LayoutService);
  private dialog = inject(MatDialog);
  authService = inject(AuthService);

  navItems = [
    { label: 'Board', route: '/board', matIcon: 'dashboard' },
    { label: 'Team', route: '/users', matIcon: 'supervisor_account' },
    { label: 'Analytics', route: '/analytics', matIcon: 'show_chart' },

  ];

  openAddBoardDialog(): void {
    this.dialog.open(BoardAddComponent, { panelClass: ['app-dialog', 'sm'], disableClose: true });
  }
}
