import { ProjectsData } from "./types";
import { generateSeedData } from "./seed-data";

const STORAGE_KEY = "npd-process-data";

export function loadProjects(): ProjectsData {
  if (typeof window === "undefined") {
    return { projects: [] };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error("Failed to load from localStorage:", err);
  }

  // First time: generate seed data and persist it
  const seed = generateSeedData();
  saveProjects(seed);
  return seed;
}

export function saveProjects(data: ProjectsData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}
