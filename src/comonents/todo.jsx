import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A modern, responsive & persistent Todo component
 * -------------------------------------------------
 * - Uses framer‑motion for smooth item transitions
 * - Persists tasks in localStorage so they survive reloads
 * - Shows a live counter of remaining tasks
 * - Tailwind utility classes make it fully responsive & dark‑mode friendly
 *
 *  Install deps:
 *  ```bash
 *  npm i framer-motion lucide-react
 *  ```
 *  Tailwind should have `darkMode: "class"` enabled in tailwind.config.js for dark‑mode support.
 */
export default function Todo() {
  // ─── State & Persistence ───────────────────────────────────────────────
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [inputDate, setInputDate] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // ─── Handlers ─────────────────────────────────────────────────────────
  const addTodo = () => {
    const text = inputValue.trim();
    if (!text) return;
    setTodos([
      ...todos,
      { 
        id: crypto.randomUUID(), 
        text, 
        completed: false,
        date: inputDate || new Date().toISOString().split('T')[0]
      },
    ]);
    setInputValue("");
    setInputDate("");
  };

  const toggleTodo = (id) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTodo = (id) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  // ─── UI ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-neutral-900 dark:to-neutral-800 py-10 px-4">
        
      <div className="w-full max-w-md bg-white/90 dark:bg-neutral-900/70 backdrop-blur rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 drop-shadow mb-8 text-center">
          My Tasks
        </h1>

        {/* Input */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 rounded-lg border border-gray-300 dark:border-neutral-700 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300/50 dark:bg-neutral-800 dark:text-neutral-100"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              autoFocus
            />
            <input
              type="date"
              className="rounded-lg border border-gray-300 dark:border-neutral-700 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300/50 dark:bg-neutral-800 dark:text-neutral-100"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
            />
          </div>
          <button
            onClick={addTodo}
            className="w-full rounded-lg bg-indigo-500 px-6 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
          >
            Add
          </button>
        </div>

        {/* Counter */}
        {todos.length > 0 && (
          <p className="mb-4 text-right text-xs text-gray-500 dark:text-neutral-400">
            {todos.filter((t) => !t.completed).length} of {todos.length} left
          </p>
        )}

        {/* List */}
        <AnimatePresence initial={false}>
          {todos.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-400 dark:text-neutral-500"
            >
              Nothing here yet…
            </motion.p>
          ) : (
            todos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`group flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
  todo.completed
    ? "bg-gray-100/70 dark:bg-neutral-800/60 line-through text-gray-400 dark:text-neutral-500 border-gray-200 dark:border-neutral-700"
    : "bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700"
}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600"
                />
                <span className="flex-1 break-words select-none">
                  {todo.text}
                </span>
                {todo.date && (
                  <span className="text-xs text-gray-500 dark:text-neutral-400">
                    {new Date(todo.date).toLocaleDateString()}
                  </span>
                )}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 focus-visible:opacity-100"
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
