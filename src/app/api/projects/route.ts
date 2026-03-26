import { put, get, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { ProjectsData } from "@/lib/types";
import { generateSeedData } from "@/lib/seed-data";

const BLOB_PATH = "projects.json";

export async function GET() {
  try {
    const result = await get(BLOB_PATH, { access: "private" });

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
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to read from Blob:", message, error);
    return NextResponse.json(
      { error: "Failed to load projects", detail: message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data: ProjectsData = await request.json();
    await put(BLOB_PATH, JSON.stringify(data), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to write to Blob:", message, error);
    return NextResponse.json(
      { error: "Failed to save projects", detail: message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Try to delete existing blob, ignore if not found
    try {
      await del(BLOB_PATH);
    } catch {
      // Blob may not exist yet, that's fine
    }
    // Reseed with original data
    return await seedAndReturn();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to reseed:", message, error);
    return NextResponse.json(
      { error: "Failed to reseed projects", detail: message },
      { status: 500 }
    );
  }
}

async function seedAndReturn() {
  const seed = generateSeedData();
  await put(BLOB_PATH, JSON.stringify(seed), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  return NextResponse.json(seed);
}
