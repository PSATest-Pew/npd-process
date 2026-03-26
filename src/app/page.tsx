"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Project, Card } from "@/lib/types";
import { loadProjects, saveProjects as persistProjects } from "@/lib/storage";
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

  useEffect(() => {
    loadProjects()
      .then((data) => {
        setProjects(data.projects);
        if (data.projects.length > 0) {
          setActiveProjectId(data.projects[0].id);
        }
      })
      .catch((err) => console.error("Failed to load projects:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const saveAndUpdate = (updated: Project[]) => {
    setProjects(updated);
    persistProjects({ projects: updated }).catch((err) =>
      console.error("Failed to save:", err)
    );
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
    saveAndUpdate([...projects, newProject]);
    setActiveProjectId(newProject.id);
  };

  const handleRenameProject = (id: string, name: string) => {
    saveAndUpdate(projects.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    if (activeProjectId === id && updated.length > 0) {
      setActiveProjectId(updated[0].id);
    }
    saveAndUpdate(updated);
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
    saveAndUpdate(
      projects.map((p) =>
        p.id === activeProjectId ? { ...p, cards: reordered } : p
      )
    );
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsPanelOpen(true);
  };

  const handleCardSave = (updatedCard: Card) => {
    saveAndUpdate(
      projects.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              cards: p.cards.map((c) =>
                c.id === updatedCard.id ? updatedCard : c
              ),
            }
          : p
      )
    );
  };

  const handleCardDelete = (cardId: string) => {
    saveAndUpdate(
      projects.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              cards: p.cards
                .filter((c) => c.id !== cardId)
                .map((c, i) => ({ ...c, sortOrder: i })),
            }
          : p
      )
    );
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
    saveAndUpdate(
      projects.map((p) =>
        p.id === activeProjectId ? { ...p, cards: [...p.cards, newCard] } : p
      )
    );
  };

  const handleExportPdf = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="text-stone-500">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-white border-b border-stone-300 print:border-none">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">
            NPD Process Tracker
          </h1>
          <span className="text-sm text-stone-500 print:hidden">
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
        <h2 className="text-lg font-bold text-stone-900">
          {activeProject?.name}
        </h2>
        <p className="text-xs text-stone-500 mt-1">
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
          <div className="text-center text-stone-500 py-12">
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
            <tr className="border-b border-stone-300">
              <th className="text-left py-1 pr-2 w-8">#</th>
              <th className="text-left py-1 pr-2">Step</th>
              <th className="text-left py-1 pr-2 w-32">Department</th>
              <th className="text-left py-1 w-48">Notes</th>
            </tr>
          </thead>
          <tbody>
            {sortedCards.map((card, i) => (
              <tr key={card.id} className="border-b border-stone-200">
                <td className="py-1 pr-2 text-stone-400">{i + 1}</td>
                <td className="py-1 pr-2 text-stone-900">{card.name}</td>
                <td className="py-1 pr-2 text-stone-600">{card.department}</td>
                <td className="py-1 text-stone-600">{card.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
