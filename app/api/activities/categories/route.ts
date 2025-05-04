import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.activity_category.findMany({
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

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching activity categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity categories" },
      { status: 500 }
    );
  }
}