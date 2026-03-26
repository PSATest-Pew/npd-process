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
      className={`flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3 cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? "shadow-lg opacity-90 z-50" : ""
      }`}
      onClick={onClick}
    >
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 touch-none"
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

      <span className="flex-1 text-sm text-slate-800 font-medium print:text-xs">
        {card.name}
      </span>

      {card.department && (
        <span className="flex-shrink-0 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
          {card.department}
        </span>
      )}
    </div>
  );
}
