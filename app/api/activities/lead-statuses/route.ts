import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const leadStatuses = await prisma.activity_lead_status.findMany({
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

    return NextResponse.json(leadStatuses);
  } catch (error) {
    console.error("Error fetching activity lead statuses:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity lead statuses" },
      { status: 500 }
    );
  }
}