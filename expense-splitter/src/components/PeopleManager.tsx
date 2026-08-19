import { useState } from "react";
import { useExpenseStore } from "@/store/useExpenseStore";
import { UserPlus, UserMinus, User } from "lucide-react";

export default function PeopleManager() {
  const { persons, addPerson, removePerson } = useExpenseStore();
  const [name, setName] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addPerson(name.trim());
      setName("");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <UsersIcon className="w-5 h-5 text-blue-500" />
          Who is on this trip?
        </h2>
        
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name (e.g., Alice)"
            className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white p-2.5 px-4 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {persons.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 dark:text-zinc-400">
            <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No one added yet.</p>
            <p className="text-sm">Add some friends to start splitting!</p>
          </div>
        ) : (
          persons.map((person) => (
            <div 
              key={person.id} 
              className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {person.name}
                </span>
              </div>
              <button
                onClick={() => removePerson(person.id)}
                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
                aria-label="Remove person"
              >
                <UserMinus className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
