import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ProjectsData } from "@/lib/types";
import { generateSeedData } from "@/lib/seed-data";

const DATA_FILE = path.join(process.cwd(), "data", "projects.json");

function ensureDataFile(): ProjectsData {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const seedData = generateSeedData();
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedData, null, 2));
    return seedData;
  }

  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function GET() {
  const data = ensureDataFile();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const data: ProjectsData = await request.json();

  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  return NextResponse.json(data);
}
