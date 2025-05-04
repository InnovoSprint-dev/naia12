import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const types = await prisma.activity_type.findMany({
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


    return NextResponse.json(types);
  } catch (error) {
    console.error("Error fetching activity types:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity types" },
      { status: 500 }
    );
  }
}