import { put, get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { ProjectsData } from "@/lib/types";
import { generateSeedData } from "@/lib/seed-data";

const BLOB_PATH = "projects.json";

export async function GET() {
  try {
    const result = await get(BLOB_PATH, { access: "public" });

    if (result && result.statusCode === 200) {
      const text = await new Response(result.stream).text();
      const data: ProjectsData = JSON.parse(text);
      return NextResponse.json(data);
    }

    // Blob doesn't exist yet — seed it
    return await seedAndReturn();
  } catch (error: unknown) {
    // BlobNotFoundError means first run — seed data
    if (
      error instanceof Error &&
      error.constructor.name === "BlobNotFoundError"
    ) {
      return await seedAndReturn();
    }
    console.error("Failed to read from Blob:", error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data: ProjectsData = await request.json();
    await put(BLOB_PATH, JSON.stringify(data), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to write to Blob:", error);
    return NextResponse.json(
      { error: "Failed to save projects" },
      { status: 500 }
    );
  }
}

async function seedAndReturn() {
  const seed = generateSeedData();
  await put(BLOB_PATH, JSON.stringify(seed), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  return NextResponse.json(seed);
}
