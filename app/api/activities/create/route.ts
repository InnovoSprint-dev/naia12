import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get the current user's session using the exported authOptions
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in to create an activity" },
        { status: 401 }
      );
    }

    // Get user from database to use as creator
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Parse request body
    const data = await request.json();
    
    // Create the activity with properly typed budget
    const budget = typeof data.budget === 'string' 
      ? parseFloat(data.budget) 
      : (typeof data.budget === 'number' ? data.budget : null);
    
    // Debug what's received from the client
    console.log("Received data:", data);
    
    // If salesBrokerId is missing, use the salesPersonId as a fallback
    // This ensures we always have a valid broker ID according to the schema
    const salesBrokerId = data.salesBrokerId || data.salesPersonId;
    
    // Check required fields
    if (!data.activityTitle || !data.salesPersonId || !data.activitySourceId || 
        !data.activityCategoryId || !data.activityTypeId || !data.projectId || 
        !data.activityUnitTypeId || !data.activityLeadStatusId || !salesBrokerId) {
      return NextResponse.json(
        { error: "Missing required fields", 
          received: {
            title: !!data.activityTitle,
            salesPerson: !!data.salesPersonId,
            salesBroker: !!salesBrokerId,
            source: !!data.activitySourceId,
            category: !!data.activityCategoryId,
            type: !!data.activityTypeId,
            project: !!data.projectId,
            unitType: !!data.activityUnitTypeId,
            leadStatus: !!data.activityLeadStatusId,
          }
        },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        activityTitle: data.activityTitle,
        activityDate: new Date(data.activityDate), // Ensure this is a proper Date object
        createdById: user.id,
        
        // Required relations with proper ID types
        salesPersonId: data.salesPersonId,
        salesBrokerId: salesBrokerId, // Use our fallback value if needed
        activitySourceId: data.activitySourceId,
        activityCategoryId: data.activityCategoryId,
        activityTypeId: data.activityTypeId,
        projectId: data.projectId,
        activityUnitTypeId: data.activityUnitTypeId,
        activityLeadStatusId: data.activityLeadStatusId,
        
        // Optional fields
        clientName: data.clientName || null,
        budget: budget,
        contact: data.contact || null,
        compatetior: data.compatetior || null,
        leadBrokerage: data.leadBrokerage || false,
        agentBrokerage: data.agentBrokerage || false,
        Remarks: data.Remarks || null,
        
        // Optional relation - only include if it exists
        ...(data.activityNotInterestedReasonId ? { 
          activityNotInterestedReasonId: data.activityNotInterestedReasonId 
        } : {})
      },
    });

    return NextResponse.json(
      { 
        message: "Activity created successfully", 
        activity 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating activity:", error);
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "An activity with this title already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "An error occurred while creating the activity",
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}