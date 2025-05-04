import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const unitTypes = await prisma.activity_unit_type.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(unitTypes);
  } catch (error) {
    console.error("Error fetching activity unit types:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity unit types" },
      { status: 500 }
    );
  }
}