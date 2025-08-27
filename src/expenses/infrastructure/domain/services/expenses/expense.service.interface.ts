import { Observable } from 'rxjs';
import { Expense } from './models/expense.model';

export interface ExpenseService {
  /**
   * Lists all expenses within a date range
   * @param startDate Date
   * @param endDate Date
   */
  listByDateRange(startDate: Date, endDate: Date): Observable<Expense[]>;

  /**
   * Lists all expenses
   */
  list(): Observable<Expense[]>;

  /**
   * Creates a new expense
   * @param expense The expense to create
   */
  create(expense: Omit<Expense, 'id'>): Observable<Expense>;

  /**
   * Updates an existing expense
   * @param id The ID of the expense to update
   * @param expense The updated expense data
   */
  update(id: string, expense: Partial<Omit<Expense, 'id'>>): Observable<void>;

  /**
   * Deletes an expense
   * @param id The ID of the expense to delete
   */
  delete(id: string): Observable<void>;

  /**
   * Gets an expense by ID
   * @param id The ID of the expense to get
   */
  getById(id: string): Observable<Expense | null>;
}
