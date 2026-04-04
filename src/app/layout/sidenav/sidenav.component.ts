import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  protected layout = inject(LayoutService);

  navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Tasks', route: '/tasks', icon: '✅' },
    { label: 'Team (Users)', route: '/team', icon: '👥' },
    { label: 'Calendar', route: '/calendar', icon: '📅' },
    { label: 'Analytics', route: '/analytics', icon: '📈' },
    { label: 'Settings', route: '/settings', icon: '⚙️' },
  ];
}
