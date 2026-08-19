import { useState } from "react";
import { useExpenseStore, Expense } from "@/store/useExpenseStore";
import ExpenseForm from "./ExpenseForm";
import { Receipt, Plus, Pencil, Trash2, ReceiptText } from "lucide-react";

export default function ExpenseManager() {
  const { expenses, persons, deleteExpense } = useExpenseStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const getPersonName = (id: string) => {
    return persons.find(p => p.id === id)?.name || "Unknown";
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
          <Receipt className="w-6 h-6 text-indigo-500" />
          Expenses
        </h2>
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsFormOpen(true);
          }}
          disabled={persons.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white p-2.5 px-4 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>New</span>
        </button>
      </div>

      {persons.length === 0 && expenses.length === 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 p-4 rounded-xl text-sm border border-amber-200 dark:border-amber-900/50">
          You need to add people first before you can log an expense.
        </div>
      )}

      {expenses.length === 0 && persons.length > 0 ? (
        <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
          <ReceiptText className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No expenses logged yet.</p>
          <p className="text-sm">Click 'New' to add your first expense!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {expenses.slice().reverse().map((expense) => (
            <div 
              key={expense.id} 
              className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">{expense.description}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Paid by <span className="font-medium text-zinc-700 dark:text-zinc-300">{getPersonName(expense.payerId)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    Rs. {expense.amount.toFixed(2)}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-full">
                    {expense.splitType} split
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end mt-1 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <button
                  onClick={() => {
                    setEditingExpense(expense);
                    setIsFormOpen(true);
                  }}
                  className="p-2 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <ExpenseForm 
          onClose={() => setIsFormOpen(false)} 
          initialExpense={editingExpense} 
        />
      )}
    </div>
  );
}
