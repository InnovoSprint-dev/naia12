import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const reasons = await prisma.activity_not_interested_reason.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(reasons);
  } catch (error) {
    console.error("Error fetching activity not interested reasons:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity not interested reasons" },
      { status: 500 }
    );
  }
}