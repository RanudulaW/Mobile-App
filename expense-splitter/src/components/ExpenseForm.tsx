import { useState } from "react";
import { useExpenseStore, SplitType, Expense } from "@/store/useExpenseStore";
import { calculateEqualSplits } from "@/utils/calculations";
import { Calculator, X, Check } from "lucide-react";

export default function ExpenseForm({ 
  onClose,
  initialExpense = null
}: { 
  onClose: () => void;
  initialExpense?: Expense | null;
}) {
  const { persons, addExpense, editExpense } = useExpenseStore();
  
  const [description, setDescription] = useState(initialExpense?.description || "");
  const [amount, setAmount] = useState<string>(initialExpense?.amount.toString() || "");
  const [payerId, setPayerId] = useState(initialExpense?.payerId || (persons.length > 0 ? persons[0].id : ""));
  const [splitType, setSplitType] = useState<SplitType>(initialExpense?.splitType || "equal");
  
  // For exact splits
  const [exactSplits, setExactSplits] = useState<Record<string, string>>(
    initialExpense?.splitType === "exact" 
      ? Object.fromEntries(Object.entries(initialExpense.splits).map(([k, v]) => [k, v.toString()]))
      : {}
  );
  // For equal splits - who is involved (default to everyone)
  const [involvedIds, setInvolvedIds] = useState<Set<string>>(
    initialExpense?.splitType === "equal"
      ? new Set(Object.keys(initialExpense.splits))
      : new Set(persons.map(p => p.id))
  );

  const parsedAmount = parseFloat(amount) || 0;

  const toggleInvolved = (id: string) => {
    const newSet = new Set(involvedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setInvolvedIds(newSet);
  };

  const handleExactSplitChange = (id: string, val: string) => {
    setExactSplits(prev => ({ ...prev, [id]: val }));
  };

  const exactSplitTotal = Object.values(exactSplits).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  const isExactValid = Math.abs(exactSplitTotal - parsedAmount) < 0.01;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || parsedAmount <= 0 || !payerId) return;

    let splits: Record<string, number>;
    if (splitType === "equal") {
      if (involvedIds.size === 0) return; // Must involve at least one person
      splits = calculateEqualSplits(parsedAmount, Array.from(involvedIds));
    } else {
      if (!isExactValid) return; // Exact amounts must match
      splits = Object.fromEntries(
        Object.entries(exactSplits)
          .map(([k, v]) => [k, parseFloat(v) || 0])
          .filter(([_, v]) => v > 0)
      );
    }

    const expenseData = {
      description,
      amount: parsedAmount,
      payerId,
      splitType,
      splits
    };

    if (initialExpense) {
      editExpense(initialExpense.id, expenseData);
    } else {
      addExpense(expenseData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md max-h-[90dvh] overflow-y-auto shadow-xl border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-bottom-10 duration-300">
        <div className="sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center z-10">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-500" />
            {initialExpense ? "Edit Expense" : "Log Expense"}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Dinner, Hotel, Gas"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Amount (LKR)</label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Who Paid?</label>
              <select
                value={payerId}
                onChange={(e) => setPayerId(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
              >
                {persons.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">How is it split?</label>
            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-950 rounded-lg">
              <button
                type="button"
                onClick={() => setSplitType("equal")}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${splitType === "equal" ? "bg-white dark:bg-zinc-800 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
              >
                Equally
              </button>
              <button
                type="button"
                onClick={() => setSplitType("exact")}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${splitType === "exact" ? "bg-white dark:bg-zinc-800 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
              >
                Exact Amount
              </button>
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 mt-2">
            {splitType === "equal" ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider mb-1">Select involved people</p>
                {persons.map(p => (
                  <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={involvedIds.has(p.id)}
                      onChange={() => toggleInvolved(p.id)}
                    />
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${involvedIds.has(p.id) ? "bg-indigo-500 border-indigo-500" : "border-zinc-300 dark:border-zinc-600 group-hover:border-indigo-400"}`}>
                      {involvedIds.has(p.id) && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{p.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                 <div className="flex justify-between items-end mb-1">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Enter amounts</p>
                  <p className={`text-xs font-medium ${isExactValid ? "text-emerald-500" : "text-amber-500"}`}>
                    {exactSplitTotal.toFixed(2)} / {parsedAmount.toFixed(2)}
                  </p>
                 </div>
                {persons.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 w-24 truncate">{p.name}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={exactSplits[p.id] || ""}
                      onChange={(e) => handleExactSplitChange(p.id, e.target.value)}
                      placeholder="0.00"
                      className="flex-1 min-w-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!description || parsedAmount <= 0 || (splitType === "equal" ? involvedIds.size === 0 : !isExactValid)}
            className="mt-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl font-semibold transition-colors"
          >
            {initialExpense ? "Save Changes" : "Log Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
