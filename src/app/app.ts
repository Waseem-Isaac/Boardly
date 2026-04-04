import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './layout/header/header.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { LayoutService } from './core/services/layout.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, HeaderComponent, SidenavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  protected layout = inject(LayoutService);
}
