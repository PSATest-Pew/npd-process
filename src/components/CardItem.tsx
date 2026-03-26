"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/lib/types";

interface CardItemProps {
  card: Card;
  onClick: () => void;
}

export default function CardItem({ card, onClick }: CardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 cursor-pointer hover:border-slate-500 hover:bg-slate-750 transition-all ${
        isDragging ? "shadow-lg shadow-blue-500/10 opacity-90 z-50 border-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 touch-none"
        onClick={(e) => e.stopPropagation()}
        title="Drag to reorder"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </button>

      <span className="flex-1 text-sm text-slate-100 font-medium print:text-xs">
        {card.name}
      </span>

      {card.department && (
        <span className="flex-shrink-0 text-xs bg-blue-500/15 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/30 font-medium">
          {card.department}
        </span>
      )}
    </div>
  );
}
