"use client";

import { useState } from "react";

interface AddCardButtonProps {
  onAdd: (name: string) => void;
}

export default function AddCardButton({ onAdd }: AddCardButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");

  const handleAdd = () => {
    const trimmed = name.trim();
    if (trimmed) {
      onAdd(trimmed);
      setName("");
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-colors print:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Card
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 py-2 print:hidden">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
          if (e.key === "Escape") {
            setIsAdding(false);
            setName("");
          }
        }}
        placeholder="Card name"
        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
        autoFocus
      />
      <button
        onClick={handleAdd}
        className="px-3 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
      >
        Add
      </button>
      <button
        onClick={() => {
          setIsAdding(false);
          setName("");
        }}
        className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700"
      >
        Cancel
      </button>
    </div>
  );
}
