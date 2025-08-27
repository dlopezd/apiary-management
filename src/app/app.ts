import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { MenubarModule } from 'primeng/menubar';
import { AUTHENTICATION_SERVICE } from '../authentication/infrastructure/framework/auth.token';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MenubarModule, ButtonModule, RouterOutlet],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private primeng = inject(PrimeNG);
  private authService = inject(AUTHENTICATION_SERVICE);
  shouldRenderLayout = false;

  constructor() {
    effect(() => {
      this.shouldRenderLayout = this.authService.isAuthenticated();
    });
  }

  ngOnInit() {
    this.primeng.ripple.set(true);
  }

  menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: PrimeIcons.HOME,
    },
    {
      label: 'Reportes',
      icon: PrimeIcons.CALCULATOR,
      items: [
        {
          label: 'Totalizados por Centro de Costo',
          icon: PrimeIcons.FILE_PLUS,
          routerLink: '/reports/totalized-cost-center',
        },
      ],
    },
    {
      label: 'Gestión',
      icon: PrimeIcons.FOLDER,
      items: [
        {
          label: 'Centros de Costos',
          icon: PrimeIcons.CALCULATOR,
          routerLink: '/cost-centers',
        },
        {
          label: 'Gastos',
          icon: PrimeIcons.MONEY_BILL,
          routerLink: '/expenses',
        },
      ],
    },
  ];

  onLogout(): void {
    this.authService.signOut().subscribe();
  }
}
