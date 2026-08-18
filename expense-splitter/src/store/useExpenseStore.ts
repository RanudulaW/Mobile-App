import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type Person = {
  id: string;
  name: string;
};

export type SplitType = 'equal' | 'exact';

export type Expense = {
  id: string;
  description: string;
  amount: number;
  payerId: string;
  splitType: SplitType;
  splits: Record<string, number>; // Maps personId to their share of the expense
  date: string;
};

interface ExpenseState {
  persons: Person[];
  expenses: Expense[];
  addPerson: (name: string) => void;
  removePerson: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  editExpense: (id: string, expense: Omit<Expense, 'id' | 'date'>) => void;
  deleteExpense: (id: string) => void;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      persons: [],
      expenses: [],
      addPerson: (name) => set((state) => ({
        persons: [...state.persons, { id: uuidv4(), name }]
      })),
      removePerson: (id) => set((state) => ({
        persons: state.persons.filter(p => p.id !== id),
        // If a person is removed, we also clean up expenses they were part of to avoid orphaned data
        expenses: state.expenses.filter(e => e.payerId !== id && e.splits[id] === undefined)
      })),
      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: uuidv4(), date: new Date().toISOString() }]
      })),
      editExpense: (id, updatedExpense) => set((state) => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, ...updatedExpense } : e)
      })),
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id)
      })),
    }),
    {
      name: 'expense-splitter-storage', // key in localStorage
    }
  )
);
