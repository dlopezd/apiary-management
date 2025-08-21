import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { FirebaseAuthenticationService } from '../../../authentication/infrastructure/domain/services/authentication/firebase-authentication.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private authService = inject(FirebaseAuthenticationService);

  menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home'
    },
    {
      label: 'Colmenas',
      icon: 'pi pi-box',
      items: [
        {
          label: 'Ver Colmenas',
          icon: 'pi pi-list'
        },
        {
          label: 'Agregar Colmena',
          icon: 'pi pi-plus'
        }
      ]
    },
    {
      label: 'Producción',
      icon: 'pi pi-chart-bar',
      items: [
        {
          label: 'Registros',
          icon: 'pi pi-database'
        },
        {
          label: 'Estadísticas',
          icon: 'pi pi-chart-line'
        }
      ]
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog'
    }
  ];

  async onLogout(): Promise<void> {
    await this.authService.signOut();
  }
}
