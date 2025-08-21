import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { CostCenterService } from './cost-center.service.interface';
import { CostCenter } from './models/cost-center.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreCostCenterService implements CostCenterService {
  private firestore = inject(Firestore);
  private readonly collectionName = 'cost-centers';

  async list(): Promise<CostCenter[]> {
    try {
      const collectionRef = collection(this.firestore, this.collectionName);
      const q = query(collectionRef, orderBy('name'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as CostCenter,
      );
    } catch (error) {
      console.error('Error al listar centros de costos:', error);
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<CostCenter | null> {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as CostCenter;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(costCenter: Omit<CostCenter, 'id'>): Promise<CostCenter> {
    try {
      const collectionRef = collection(this.firestore, this.collectionName);
      const docRef = await addDoc(collectionRef, costCenter);
      const newDoc = await getDoc(docRef);

      return {
        id: newDoc.id,
        ...newDoc.data(),
      } as CostCenter;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, costCenter: Omit<CostCenter, 'id'>): Promise<CostCenter> {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      await updateDoc(docRef, costCenter);
      const updatedDoc = await getDoc(docRef);

      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      } as CostCenter;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return new Error(`Error en el servicio de centros de costos: ${error.message}`);
    }
    return new Error('Ha ocurrido un error desconocido en el servicio de centros de costos');
  }
}
