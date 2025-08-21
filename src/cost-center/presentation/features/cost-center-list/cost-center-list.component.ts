import { Component, inject, signal } from '@angular/core';
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
export class CostCenterListComponent {
  private listCostCentersUseCase = inject(ListCostCentersUseCase);
  private createCostCenterUseCase = inject(CreateCostCenterUseCase);
  private updateCostCenterUseCase = inject(UpdateCostCenterUseCase);
  private deleteCostCenterUseCase = inject(DeleteCostCenterUseCase);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  costCenters = signal<CostCenter[]>([]);
  isLoading = signal(true);
  showDialog = false;
  dialogMode: 'create' | 'edit' = 'create';
  selectedCostCenter: CostCenter | null = null;
  newCostCenterName = '';

  constructor() {
    this.loadCostCenters();
  }

  openForCreate() {
    this.dialogMode = 'create';
    this.newCostCenterName = '';
    this.selectedCostCenter = null;
    this.showDialog = true;
  }

  private async loadCostCenters() {
    try {
      this.isLoading.set(true);
      const centers = await this.listCostCentersUseCase.execute();
      this.costCenters.set(centers);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los centros de costos',
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  async onCreate() {
    if (!this.newCostCenterName) return;

    try {
      await this.createCostCenterUseCase.execute(this.newCostCenterName);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Centro de costos creado correctamente',
      });
      this.showDialog = false;
      this.newCostCenterName = '';
      await this.loadCostCenters();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo crear el centro de costos',
      });
    }
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

  async onUpdate() {
    if (!this.selectedCostCenter || !this.newCostCenterName) return;

    try {
      await this.updateCostCenterUseCase.execute(
        this.selectedCostCenter.id,
        this.newCostCenterName,
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Centro de costos actualizado correctamente',
      });
      this.closeDialog();
      await this.loadCostCenters();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el centro de costos',
      });
    }
  }

  onDelete(costCenter: CostCenter) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el centro de costos "${costCenter.name}"?`,
      accept: async () => {
        try {
          await this.deleteCostCenterUseCase.execute(costCenter.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Centro de costos eliminado correctamente',
          });
          await this.loadCostCenters();
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el centro de costos',
          });
        }
      },
    });
  }
}
