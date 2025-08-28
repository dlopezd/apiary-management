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
import { catchError, from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreCostCenterService implements CostCenterService {
  private firestore = inject(Firestore);
  private readonly collectionName = 'cost-centers';

  list(): Observable<CostCenter[]> {
    const collectionRef = collection(this.firestore, this.collectionName);
    const q = query(collectionRef, orderBy('name'));
    const querySnapshot = from(getDocs(q));

    return querySnapshot.pipe(
      catchError((error) => {
        console.error('Error al listar centros de costos:', error);
        throw error;
      }),
      map((snapshot) =>
        snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as CostCenter,
        ),
      ),
    );
  }

  getById(id: string): Observable<CostCenter | null> {
    const docRef = doc(this.firestore, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      catchError((error) => {
        console.error(`Error al obtener el centro de costos con ID ${id}:`, error);
        throw error;
      }),
      map((snapshot) => {
        if (!snapshot.exists()) {
          return null;
        }
        return {
          id: snapshot.id,
          ...snapshot.data(),
        } as CostCenter;
      }),
    );
  }

  create(costCenter: Omit<CostCenter, 'id'>): Observable<CostCenter> {
    const collectionRef = collection(this.firestore, this.collectionName);
    const docRef = from(addDoc(collectionRef, costCenter));
    return docRef.pipe(
      catchError((error) => {
        console.error('Error al crear centro de costos:', error);
        throw error;
      }),
      switchMap((docRef) => from(getDoc(docRef))),
      map((snapshot) => {
        if (!snapshot.exists()) {
          throw new Error('Error al crear centro de costos: documento no encontrado');
        }
        return {
          id: snapshot.id,
          ...snapshot.data(),
        } as CostCenter;
      }),
    );
  }

  update(id: string, costCenter: Omit<CostCenter, 'id'>): Observable<CostCenter> {
    const docRef = doc(this.firestore, this.collectionName, id);
    return from(updateDoc(docRef, costCenter)).pipe(
      catchError((error) => {
        console.error(`Error al actualizar el centro de costos con ID ${id}:`, error);
        throw error;
      }),
      switchMap(() => from(getDoc(docRef))),
      map((snapshot) => {
        if (!snapshot.exists()) {
          throw new Error(
            `Error al actualizar el centro de costos con ID ${id}: documento no encontrado`,
          );
        }
        return {
          id: snapshot.id,
          ...snapshot.data(),
        } as CostCenter;
      }),
    );
  }

  delete(id: string): Observable<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    return from(deleteDoc(docRef)).pipe(
      catchError((error) => {
        console.error(`Error al eliminar el centro de costos con ID ${id}:`, error);
        throw error;
      }),
    );
  }
}
