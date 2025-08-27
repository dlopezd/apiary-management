import { Component, OnDestroy, inject, signal } from '@angular/core';
import { ListCostCentersUseCase } from '../../../usecases/list-cost-centers.use-case';
import { CreateCostCenterUseCase } from '../../../usecases/create-cost-center.use-case';
import { UpdateCostCenterUseCase } from '../../../usecases/update-cost-center.use-case';
import { DeleteCostCenterUseCase } from '../../../usecases/delete-cost-center.use-case';
import { CostCenter } from '../../../infrastructure/domain/services/cost-center/models/cost-center.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cost-center-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cost-center-list.component.html',
})
export class CostCenterListComponent implements OnDestroy {
  private listCostCentersUseCase = inject(ListCostCentersUseCase);
  private createCostCenterUseCase = inject(CreateCostCenterUseCase);
  private updateCostCenterUseCase = inject(UpdateCostCenterUseCase);
  private deleteCostCenterUseCase = inject(DeleteCostCenterUseCase);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private destroy$ = new Subject<void>();

  costCenters = signal<CostCenter[]>([]);
  isLoading = signal(true);
  showDialog = false;
  dialogMode: 'create' | 'edit' = 'create';
  selectedCostCenter: CostCenter | null = null;
  newCostCenterName = '';

  constructor() {
    this.loadCostCenters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openForCreate() {
    this.dialogMode = 'create';
    this.newCostCenterName = '';
    this.selectedCostCenter = null;
    this.showDialog = true;
  }

  private loadCostCenters() {
    this.isLoading.set(true);
    this.listCostCentersUseCase
      .execute()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (centers) => {
          this.costCenters.set(centers);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los centros de costos',
          });
        },
      });
  }

  onCreate() {
    if (!this.newCostCenterName) return;

    this.createCostCenterUseCase
      .execute(this.newCostCenterName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Centro de costos creado correctamente',
          });
          this.showDialog = false;
          this.newCostCenterName = '';
          this.loadCostCenters();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el centro de costos',
          });
        },
      });
  }

  openCreateDialog() {
    this.dialogMode = 'create';
    this.newCostCenterName = '';
    this.selectedCostCenter = null;
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.newCostCenterName = '';
    this.selectedCostCenter = null;
  }

  onEdit(costCenter: CostCenter) {
    this.dialogMode = 'edit';
    this.selectedCostCenter = costCenter;
    this.newCostCenterName = costCenter.name;
    this.showDialog = true;
  }

  onUpdate() {
    if (!this.selectedCostCenter || !this.newCostCenterName) return;

    this.updateCostCenterUseCase
      .execute(this.selectedCostCenter.id, this.newCostCenterName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Centro de costos actualizado correctamente',
          });
          this.closeDialog();
          this.loadCostCenters();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el centro de costos',
          });
        },
      });
  }

  onDelete(costCenter: CostCenter) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el centro de costos "${costCenter.name}"?`,
      accept: () => {
        this.deleteCostCenterUseCase
          .execute(costCenter.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Centro de costos eliminado correctamente',
              });
              this.loadCostCenters();
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el centro de costos',
              });
            },
          });
      },
    });
  }
}
