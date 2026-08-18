import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
      <header className="sticky top-0 z-10 p-4 flex justify-between items-center backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Expense Splitter
        </h1>
        <ThemeToggle />
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto p-4 flex flex-col gap-6 pt-8">
        <section className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h2 className="text-lg font-semibold mb-2">Welcome</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Phase 1 is complete! The app is initialized with Next.js, Tailwind CSS, and Dark Mode support.
          </p>
        </section>
      </main>
    </div>
  );
}
