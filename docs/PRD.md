# PRD: NPD Process Tracker — Draggable Card List Web App

## Context

The team needs a shared tool to track New Product Development (NPD) process steps across different project types (Copy Job, Fully New, Line Extension, Component Changes). Today these steps live in a markdown file as bullet lists. The goal is to turn this into an interactive web app where steps are draggable cards that can be reordered, annotated with responsible departments and notes, and managed (add/edit/delete) by a small team — no authentication required.

---

## Core Requirements

### Data Model
- **Projects (Tabs):** Each H2 heading becomes a tab. Initial tabs: Fully New, Line Extension, Component Changes, Copy Job
- **Cards (Steps):** Each bullet item becomes a card within its project tab
- **Card Fields:**
  - **Name** — the step/task title (from the bullet text)
  - **Responsible Department** — dropdown: `Engineering`, `Testing`, `Quality`, `Product Management`, `Procurement`, `Assembly`, `Supplier`
  - **Notes** — plain text field
  - **Sort Order** — persisted position for drag-and-drop ordering

### Initial Data Seeding
- All four tabs are pre-populated with the full Copy Job card list (~120 steps)
- Departments and notes start empty for all cards

---

## Features (V0)

### 1. Tab Navigation
- Horizontal tab bar across the top for switching between projects
- Users can **add**, **rename**, and **delete** tabs from the UI
- Deleting a tab should prompt a confirmation dialog

### 2. Draggable Card List
- Cards displayed as a vertical list within each tab
- Drag-and-drop to reorder cards **within a tab only** (no cross-tab dragging)
- Card shows its name prominently; department shown as a subtle badge/tag if assigned
- Library: `@dnd-kit` (lightweight, accessible, React-friendly)

### 3. Card Side Panel (Edit)
- Clicking a card opens a **right-side slide-in panel**
- Panel contains:
  - Editable card name (text input)
  - Responsible Department (dropdown select)
  - Notes (plain text area)
  - Delete card button (with confirmation)
- Changes auto-save or save on close

### 4. Card Management
- **Add** new card via a button at the bottom of the card list (within each tab)
- **Edit** card via the side panel
- **Delete** card via the side panel (with confirmation)

### 5. Export to PDF
- Button to export the current tab's card list as a PDF
- PDF includes: project name, card order, card name, department, notes
- Library: browser `window.print()` with print-friendly CSS

### 6. Persistence
- Data stored in a **local JSON file** on the server
- Next.js API routes handle read/write operations
- JSON structure: array of projects, each containing an ordered array of cards

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) + React |
| Language | TypeScript |
| Drag & Drop | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Styling | Tailwind CSS |
| PDF Export | Print-friendly CSS with `window.print()` |
| Data | Local JSON file via Next.js API routes |

---

## Design

- **Corporate / professional** aesthetic
- Muted color palette (slate, gray, navy accents)
- Clean sans-serif typography
- Cards: white background, subtle border, light shadow on hover
- Tabs: underline-style active indicator
- Side panel: slides in from right with overlay backdrop
