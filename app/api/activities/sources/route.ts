import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sources = await prisma.activity_source.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        createdBy: { select: { id: true, fullName: true } },
        activity: {  select:{ project: {select: {id: true, name: true}}  }   },
        _count: {
          select: { activity: true },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(sources);
  } catch (error) {
    console.error("Error fetching activity sources:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity sources" },
      { status: 500 }
    );
  }
}