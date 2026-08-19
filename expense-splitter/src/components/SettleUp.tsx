import { useMemo } from "react";
import { useExpenseStore } from "@/store/useExpenseStore";
import { calculateBalances, calculateSettlements } from "@/utils/calculations";
import { ArrowLeftRight, CheckCircle2, ArrowRight } from "lucide-react";

export default function SettleUp() {
  const { persons, expenses } = useExpenseStore();

  const settlements = useMemo(() => {
    const balances = calculateBalances(persons, expenses);
    return calculateSettlements(balances);
  }, [persons, expenses]);

  const getPersonName = (id: string) => {
    return persons.find(p => p.id === id)?.name || "Unknown";
  };

  if (persons.length === 0 || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-500 dark:text-zinc-400 animate-in fade-in duration-500">
        <ArrowLeftRight className="w-12 h-12 mb-3 opacity-20" />
        <p>Nothing to settle yet.</p>
        <p className="text-sm">Log some expenses first!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
          <ArrowLeftRight className="w-6 h-6 text-indigo-500" />
          Settle Up
        </h2>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-950/30 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 mb-2">
        <p className="text-indigo-800 dark:text-indigo-300 text-sm font-medium leading-relaxed">
          Here is the absolute minimum number of transactions needed to settle all debts and bring everyone's balance to exactly zero.
        </p>
      </div>

      {settlements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">All Settled Up!</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Everyone's balance is zero.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {settlements.map((settlement, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate w-20">
                  {getPersonName(settlement.from)}
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center min-w-[60px]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">Pays</span>
                  <div className="w-full flex items-center">
                    <div className="h-[2px] flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-l-full"></div>
                    <ArrowRight className="w-4 h-4 text-zinc-400 -ml-1" />
                  </div>
                </div>

                <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate w-20 text-right">
                  {getPersonName(settlement.to)}
                </div>
              </div>

              <div className="ml-4 pl-4 border-l border-zinc-100 dark:border-zinc-800 text-right">
                <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                  Rs. {settlement.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
