"use client";

import { Project } from "@/lib/types";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

interface TabBarProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onAddProject: (name: string) => void;
  onRenameProject: (id: string, name: string) => void;
  onDeleteProject: (id: string) => void;
  onReorderProjects: (activeId: string, overId: string) => void;
  onExportPdf: () => void;
}

function SortableTab({
  project,
  isActive,
  editingId,
  editName,
  setEditingId,
  setEditName,
  onSelect,
  onRename,
  onDelete,
}: {
  project: Project;
  isActive: boolean;
  editingId: string | null;
  editName: string;
  setEditingId: (id: string | null) => void;
  setEditName: (name: string) => void;
  onSelect: () => void;
  onRename: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-center gap-1 px-4 py-2.5 text-sm font-medium cursor-pointer rounded-t-lg transition-colors select-none ${
        isActive
          ? "bg-slate-950 text-blue-400 border border-slate-700 border-b-slate-950 -mb-px z-10"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
      } ${isDragging ? "opacity-70 z-50" : ""}`}
      onClick={onSelect}
      {...attributes}
      {...listeners}
    >
      {editingId === project.id ? (
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={() => onRename(project.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onRename(project.id);
            if (e.key === "Escape") setEditingId(null);
          }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="bg-slate-800 border border-slate-600 rounded px-1.5 py-0.5 text-sm text-slate-100 w-32 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <>
          <span
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditingId(project.id);
              setEditName(project.name);
            }}
          >
            {project.name}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id, project.name);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="ml-1 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity"
            title="Delete project"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
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
        </>
      )}
    </div>
  );
}

export default function TabBar({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onRenameProject,
  onDeleteProject,
  onReorderProjects,
  onExportPdf,
}: TabBarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      onAddProject(trimmed);
      setNewName("");
      setIsAdding(false);
    }
  };

  const handleRename = (id: string) => {
    const trimmed = editName.trim();
    if (trimmed) {
      onRenameProject(id, trimmed);
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete project "${name}"? This cannot be undone.`)) {
      onDeleteProject(id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorderProjects(active.id as string, over.id as string);
    }
  };

  return (
    <div className="border-b border-slate-700 bg-slate-900">
      <div className="flex items-center gap-1 px-4 pt-2 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToHorizontalAxis]}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={horizontalListSortingStrategy}
          >
            {projects.map((project) => (
              <SortableTab
                key={project.id}
                project={project}
                isActive={activeProjectId === project.id}
                editingId={editingId}
                editName={editName}
                setEditingId={setEditingId}
                setEditName={setEditName}
                onSelect={() => onSelectProject(project.id)}
                onRename={handleRename}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>

        {isAdding ? (
          <div className="flex items-center gap-1 px-2 py-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") {
                  setIsAdding(false);
                  setNewName("");
                }
              }}
              placeholder="Project name"
              className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 w-36 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleAdd}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium px-2 py-1"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewName("");
              }}
              className="text-slate-500 hover:text-slate-300 text-sm px-1"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-blue-400 transition-colors"
            title="Add new project"
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
          </button>
        )}

        <div className="ml-auto flex items-center pr-2">
          <button
            onClick={onExportPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors print:hidden"
            title="Export to PDF"
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
