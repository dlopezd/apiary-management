import { inject } from '@angular/core';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  QuerySnapshot,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, forkJoin, from, map, switchMap } from 'rxjs';
import { CostCenter } from '../../../../../cost-center/infrastructure/domain/services/cost-center';
import { ExpenseService } from './expense.service.interface';
import { Expense } from './models/expense.model';

export class FirestoreExpenseService implements ExpenseService {
  private readonly firestore = inject(Firestore);
  private readonly collection = collection(this.firestore, 'expenses');

  listByDateRange(startDate: Date, endDate: Date): Observable<Expense[]> {
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);
    const expensesQuery = query(
      this.collection,
      where('date', '>=', startTimestamp),
      where('date', '<=', endTimestamp),
      orderBy('date', 'desc'),
    );

    return from(getDocs(expensesQuery)).pipe(
      switchMap((querySnapshot: QuerySnapshot<DocumentData>) => {
        // Si no hay documentos, retorna un Observable de un array vacío
        if (querySnapshot.empty) {
          return from([[]]);
        }

        // Creamos un array de Observables para cada promesa de getDoc
        const expensesWithCostCenter$ = querySnapshot.docs.map((doc) => {
          const expenseData = doc.data();
          const costCenterRef = expenseData['costCenter'] as DocumentReference<CostCenter>;

          return from(getDoc(costCenterRef)).pipe(
            map((costCenterDoc) => {
              const costCenter = costCenterDoc.data() as CostCenter;
              costCenter.id = costCenterDoc.id;
              const firebaseTimestamp = expenseData['date'];
              const jsDate = firebaseTimestamp.toDate();

              return {
                id: doc.id,
                ...expenseData,
                date: jsDate,
                costCenter,
              } as Expense;
            }),
          );
        });

        // forkJoin ejecutará todas las peticiones en paralelo
        return forkJoin(expensesWithCostCenter$);
      }),
    );
  }

  list(): Observable<Expense[]> {
    return from(getDocs(this.collection)).pipe(
      switchMap((querySnapshot: QuerySnapshot<DocumentData>) => {
        // Si no hay documentos, retorna un Observable de un array vacío
        if (querySnapshot.empty) {
          return from([[]]);
        }

        // Creamos un array de Observables para cada promesa de getDoc
        const expensesWithCostCenter$ = querySnapshot.docs.map((doc) => {
          const expenseData = doc.data();
          const costCenterRef = expenseData['costCenter'] as DocumentReference<CostCenter>;

          return from(getDoc(costCenterRef)).pipe(
            map((costCenterDoc) => {
              const costCenter = costCenterDoc.data() as CostCenter;
              costCenter.id = costCenterDoc.id;
              const firebaseTimestamp = expenseData['date'];
              const jsDate = firebaseTimestamp.toDate();

              return {
                id: doc.id,
                ...expenseData,
                date: jsDate,
                costCenter,
              } as Expense;
            }),
          );
        });

        // forkJoin ejecutará todas las peticiones en paralelo
        return forkJoin(expensesWithCostCenter$);
      }),
    );
  }

  create(expense: Omit<Expense, 'id'>): Observable<Expense> {
    // 1. Obtener la referencia de Firestore para el CostCenter
    // Esta es una operación clave y asume que ya tienes el 'id' del CostCenter
    const costCenterRef: DocumentReference<CostCenter> = doc(
      this.firestore,
      `cost-centers/${expense.costCenter.id}`,
    ) as DocumentReference<CostCenter>;

    // 2. Crear el objeto DTO con los tipos correctos para Firestore
    const expenseDTO = {
      amount: expense.amount,
      date: Timestamp.fromDate(expense.date), // Convierte el Date de JS a Timestamp
      costCenter: costCenterRef, // Asigna la referencia de Firestore
      description: expense.description,
      season: expense.season,
    };

    // 3. Crear el nuevo documento con setDoc y el objeto DTO
    const docRef = doc(collection(this.firestore, 'expenses'));
    return from(setDoc(docRef, expenseDTO)).pipe(
      map(() => ({
        id: docRef.id,
        ...expense,
      })),
    );
  }

  update(id: string, expense: Partial<Omit<Expense, 'id'>>): Observable<void> {
    const docRef = doc(this.collection, id);
    return from(updateDoc(docRef, expense));
  }

  delete(id: string): Observable<void> {
    const docRef = doc(this.collection, id);
    return from(deleteDoc(docRef));
  }

  getById(id: string): Observable<Expense | null> {
    const docRef = doc(this.collection, id);
    return from(getDoc(docRef)).pipe(
      map((docSnap: DocumentSnapshot<DocumentData>) => {
        if (!docSnap.exists()) {
          return null;
        }
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Expense;
      }),
    );
  }
}
