export interface Card {
  id: string;
  name: string;
  department: string;
  notes: string;
  whatThisMeans: string;
  whatIfWeDont: string;
  sortOrder: number;
}

export interface Project {
  id: string;
  name: string;
  sortOrder: number;
  cards: Card[];
}

export interface ProjectsData {
  projects: Project[];
}

export const DEPARTMENTS = [
  "Engineering",
  "Testing",
  "Quality",
  "Product Management",
  "Procurement",
  "Assembly",
  "Supplier",
] as const;

export type Department = (typeof DEPARTMENTS)[number] | "";
