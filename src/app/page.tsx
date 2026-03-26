"use client";

import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Project, Card, ProjectsData } from "@/lib/types";
import TabBar from "@/components/TabBar";
import CardList from "@/components/CardList";
import SidePanel from "@/components/SidePanel";
import AddCardButton from "@/components/AddCardButton";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>("");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    const data: ProjectsData = await res.json();
    setProjects(data.projects);
    if (data.projects.length > 0 && !activeProjectId) {
      setActiveProjectId(data.projects[0].id);
    }
    setIsLoading(false);
  }, [activeProjectId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const saveProjects = async (updated: Project[]) => {
    setProjects(updated);
    await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projects: updated }),
    });
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const sortedCards = activeProject
    ? [...activeProject.cards].sort((a, b) => a.sortOrder - b.sortOrder)
    : [];

  // Tab management
  const handleAddProject = (name: string) => {
    const newProject: Project = {
      id: uuidv4(),
      name,
      sortOrder: projects.length,
      cards: [],
    };
    saveProjects([...projects, newProject]);
    setActiveProjectId(newProject.id);
  };

  const handleRenameProject = (id: string, name: string) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, name } : p));
    saveProjects(updated);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    if (activeProjectId === id && updated.length > 0) {
      setActiveProjectId(updated[0].id);
    }
    saveProjects(updated);
  };

  // Card management
  const handleReorder = (activeId: string, overId: string) => {
    if (!activeProject) return;

    const cards = [...activeProject.cards].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
    const oldIndex = cards.findIndex((c) => c.id === activeId);
    const newIndex = cards.findIndex((c) => c.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const [moved] = cards.splice(oldIndex, 1);
    cards.splice(newIndex, 0, moved);

    const reordered = cards.map((c, i) => ({ ...c, sortOrder: i }));
    const updated = projects.map((p) =>
      p.id === activeProjectId ? { ...p, cards: reordered } : p
    );
    saveProjects(updated);
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsPanelOpen(true);
  };

  const handleCardSave = (updatedCard: Card) => {
    const updated = projects.map((p) =>
      p.id === activeProjectId
        ? {
            ...p,
            cards: p.cards.map((c) =>
              c.id === updatedCard.id ? updatedCard : c
            ),
          }
        : p
    );
    saveProjects(updated);
  };

  const handleCardDelete = (cardId: string) => {
    const updated = projects.map((p) =>
      p.id === activeProjectId
        ? {
            ...p,
            cards: p.cards
              .filter((c) => c.id !== cardId)
              .map((c, i) => ({ ...c, sortOrder: i })),
          }
        : p
    );
    saveProjects(updated);
  };

  const handleAddCard = (name: string) => {
    if (!activeProject) return;

    const newCard: Card = {
      id: uuidv4(),
      name,
      department: "",
      notes: "",
      sortOrder: activeProject.cards.length,
    };
    const updated = projects.map((p) =>
      p.id === activeProjectId ? { ...p, cards: [...p.cards, newCard] } : p
    );
    saveProjects(updated);
  };

  const handleExportPdf = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 print:border-none">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            NPD Process Tracker
          </h1>
          <span className="text-xs text-slate-400 print:hidden">
            {sortedCards.length} steps
          </span>
        </div>
      </header>

      <div className="print:hidden">
        <TabBar
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={setActiveProjectId}
          onAddProject={handleAddProject}
          onRenameProject={handleRenameProject}
          onDeleteProject={handleDeleteProject}
          onExportPdf={handleExportPdf}
        />
      </div>

      {/* Print header */}
      <div className="hidden print:block px-6 py-4">
        <h2 className="text-lg font-bold text-slate-800">
          {activeProject?.name}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {sortedCards.length} steps
        </p>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeProject ? (
          <>
            <CardList
              cards={sortedCards}
              onReorder={handleReorder}
              onCardClick={handleCardClick}
            />
            <div className="mt-4">
              <AddCardButton onAdd={handleAddCard} />
            </div>
          </>
        ) : (
          <div className="text-center text-slate-500 py-12">
            No projects yet. Add a project to get started.
          </div>
        )}
      </main>

      <SidePanel
        card={selectedCard}
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
          setSelectedCard(null);
        }}
        onSave={handleCardSave}
        onDelete={handleCardDelete}
      />

      {/* Print-friendly card table */}
      <div className="hidden print:block px-6">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-300">
              <th className="text-left py-1 pr-2 w-8">#</th>
              <th className="text-left py-1 pr-2">Step</th>
              <th className="text-left py-1 pr-2 w-32">Department</th>
              <th className="text-left py-1 w-48">Notes</th>
            </tr>
          </thead>
          <tbody>
            {sortedCards.map((card, i) => (
              <tr key={card.id} className="border-b border-slate-100">
                <td className="py-1 pr-2 text-slate-400">{i + 1}</td>
                <td className="py-1 pr-2">{card.name}</td>
                <td className="py-1 pr-2 text-slate-500">{card.department}</td>
                <td className="py-1 text-slate-500">{card.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
