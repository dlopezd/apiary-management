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
import { Observable, forkJoin, from, map, of, switchMap } from 'rxjs';
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
        if (querySnapshot.empty) {
          return of([]);
        }
        const expenseObservables$ = querySnapshot.docs.map((doc) =>
          this._mapDocToExpenseWithCostCenter(doc),
        );
        return forkJoin(expenseObservables$);
      }),
    );
  }

  list(): Observable<Expense[]> {
    return from(getDocs(this.collection)).pipe(
      switchMap((querySnapshot: QuerySnapshot<DocumentData>) => {
        if (querySnapshot.empty) {
          return of([]);
        }
        const expenseObservables$ = querySnapshot.docs.map((doc) =>
          this._mapDocToExpenseWithCostCenter(doc),
        );
        return forkJoin(expenseObservables$);
      }),
    );
  }

  create(expense: Omit<Expense, 'id'>): Observable<Expense> {
    const costCenterRef: DocumentReference<CostCenter> = doc(
      this.firestore,
      `cost-centers/${expense.costCenter.id}`,
    ) as DocumentReference<CostCenter>;

    const expenseDTO = {
      amount: expense.amount,
      date: Timestamp.fromDate(expense.date),
      costCenter: costCenterRef,
      description: expense.description,
      season: expense.season,
    };

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
      switchMap((docSnap: DocumentSnapshot<DocumentData>) => {
        if (!docSnap.exists()) {
          return of(null);
        }
        return this._mapDocToExpenseWithCostCenter(docSnap);
      }),
    );
  }

  private _mapDocToExpenseWithCostCenter(doc: DocumentSnapshot<DocumentData>): Observable<Expense> {
    const expenseData = doc.data()!;
    const costCenterRef = expenseData['costCenter'] as DocumentReference<CostCenter>;

    if (!costCenterRef) {
      const firebaseTimestamp = expenseData['date'] as Timestamp;
      return of({
        id: doc.id,
        ...expenseData,
        date: firebaseTimestamp.toDate(),
        costCenter: null, // O manejar como un error si el centro de costo es siempre requerido
      } as unknown as Expense);
    }

    return from(getDoc(costCenterRef)).pipe(
      map((costCenterDoc) => {
        const costCenter = costCenterDoc.exists()
          ? ({ ...costCenterDoc.data(), id: costCenterDoc.id } as CostCenter)
          : null;
        const firebaseTimestamp = expenseData['date'] as Timestamp;

        return {
          id: doc.id,
          ...expenseData,
          date: firebaseTimestamp.toDate(),
          costCenter,
        } as Expense;
      }),
    );
  }
}
