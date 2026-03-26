import { ProjectsData } from "./types";

export async function loadProjects(): Promise<ProjectsData> {
  const res = await fetch("/api/projects");
  if (!res.ok) {
    throw new Error("Failed to load projects");
  }
  return res.json();
}

export async function saveProjects(data: ProjectsData): Promise<void> {
  const res = await fetch("/api/projects", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to save projects");
  }
}
