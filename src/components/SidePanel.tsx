"use client";

import { Card, DEPARTMENTS } from "@/lib/types";
import { useState, useEffect } from "react";

interface SidePanelProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Card) => void;
  onDelete: (cardId: string) => void;
}

export default function SidePanel({
  card,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: SidePanelProps) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (card) {
      setName(card.name);
      setDepartment(card.department);
      setNotes(card.notes);
    }
  }, [card]);

  const handleSave = () => {
    if (card && name.trim()) {
      onSave({
        ...card,
        name: name.trim(),
        department,
        notes,
      });
      onClose();
    }
  };

  const handleDelete = () => {
    if (
      card &&
      window.confirm(`Delete "${card.name}"? This cannot be undone.`)
    ) {
      onDelete(card.id);
      onClose();
    }
  };

  if (!isOpen || !card) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 print:hidden"
        onClick={handleSave}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 shadow-xl z-50 flex flex-col border-l border-slate-700 print:hidden animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">Edit Card</h2>
          <button
            onClick={handleSave}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Card Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Responsible Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">— Select Department —</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              placeholder="Add notes..."
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            Delete Card
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </>
  );
}
