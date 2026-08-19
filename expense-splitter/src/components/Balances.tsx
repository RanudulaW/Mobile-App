import { useMemo } from "react";
import { useExpenseStore } from "@/store/useExpenseStore";
import { calculateBalances } from "@/utils/calculations";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

export default function Balances() {
  const { persons, expenses } = useExpenseStore();

  const balances = useMemo(() => {
    return calculateBalances(persons, expenses);
  }, [persons, expenses]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  if (persons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-500 dark:text-zinc-400 animate-in fade-in duration-500">
        <Wallet className="w-12 h-12 mb-3 opacity-20" />
        <p>No balances yet.</p>
        <p className="text-sm">Add people to see balances.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
          <Wallet className="w-6 h-6 text-emerald-500" />
          Running Balances
        </h2>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center">
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">Total Trip Expenses</p>
        <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">Rs. {totalExpenses.toFixed(2)}</p>
      </div>

      <div className="flex flex-col gap-3">
        {persons.map(person => {
          const balance = balances[person.id] || 0;
          const isOwed = balance > 0.005;
          const owes = balance < -0.005;
          const isSettled = !isOwed && !owes;

          return (
            <div 
              key={person.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-semibold text-lg">
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">{person.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    {isSettled ? "Settled up" : isOwed ? "Gets back" : "Owes"}
                  </p>
                </div>
              </div>

              <div className={`text-right flex flex-col items-end`}>
                <p className={`text-lg font-bold flex items-center gap-1 ${
                  isOwed ? "text-emerald-600 dark:text-emerald-400" : 
                  owes ? "text-rose-600 dark:text-rose-400" : 
                  "text-zinc-400"
                }`}>
                  {isOwed && <TrendingUp className="w-4 h-4" />}
                  {owes && <TrendingDown className="w-4 h-4" />}
                  Rs. {Math.abs(balance).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
