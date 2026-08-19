"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Users, Receipt, Wallet, ArrowLeftRight } from "lucide-react";
import PeopleManager from "@/components/PeopleManager";
import ExpenseManager from "@/components/ExpenseManager";
import Balances from "@/components/Balances";
import SettleUp from "@/components/SettleUp";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"people" | "expenses" | "balances" | "settle">("people");

  return (
    <div className="flex flex-col min-h-[100dvh] bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
      <header className="sticky top-0 z-20 p-4 flex justify-between items-center backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Split Expense
        </h1>
        <ThemeToggle />
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto p-4 pb-24 flex flex-col">
        {activeTab === "people" && <PeopleManager />}
        {activeTab === "expenses" && <ExpenseManager />}
        {activeTab === "balances" && <Balances />}
        {activeTab === "settle" && <SettleUp />}
      </main>

      <nav className="fixed bottom-0 w-full z-20 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
        <div className="flex justify-around items-center max-w-lg mx-auto px-2 py-3">
          <NavButton 
            active={activeTab === "people"} 
            onClick={() => setActiveTab("people")} 
            icon={<Users className="w-5 h-5" />} 
            label="People" 
          />
          <NavButton 
            active={activeTab === "expenses"} 
            onClick={() => setActiveTab("expenses")} 
            icon={<Receipt className="w-5 h-5" />} 
            label="Expenses" 
          />
          <NavButton 
            active={activeTab === "balances"} 
            onClick={() => setActiveTab("balances")} 
            icon={<Wallet className="w-5 h-5" />} 
            label="Balances" 
          />
          <NavButton 
            active={activeTab === "settle"} 
            onClick={() => setActiveTab("settle")} 
            icon={<ArrowLeftRight className="w-5 h-5" />} 
            label="Settle Up" 
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 min-w-[72px] rounded-xl transition-all duration-200 ${
        active 
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 scale-105" 
          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );
}
