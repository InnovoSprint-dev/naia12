/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma'



export async function GET(request: Request) {
 
    try{

         const data: any = {
    salesPerson: [],
     activitySource: [],
     activityCategory: [],
     activityType: [],
     project: [],
     activityUnitType: [],
     activityLeadStatus: [],
     activityNotInterestedReason: [],
     salesBroker: [],
     activity: []
  }

        data.salesPerson = await prisma.user.findMany({
            select: {
                id: true,
                fullName: true,
                managedBy: { select: { id: true, fullName: true, managedBy: {select: {id:true, fullName:true}} } }
            }   
        })
         data.activitySource = await prisma.activity_source.findMany({
            select: {
                id: true,
                name: true
            }
        })
         data.activityCategory = await prisma.activity_category.findMany({
            select: {
                id: true,
                name: true
            }
        })
         data.activityType = await prisma.activity_type.findMany({
            select: {
                id: true,
                name: true
            }
        })
         data.project = await prisma.project.findMany({
            select: {
                id: true,
                name: true
            }
        })
         data.activityUnitType = await prisma.activity_unit_type.findMany({
            select: {
                id: true,
                name: true
            }
        })
         data.activityLeadStatus = await prisma.activity_lead_status.findMany({
            select: {
                id: true,
                name: true
            }
        })
         data.activityNotInterestedReason = await prisma.activity_not_interested_reason.findMany({
            select: {
                id: true,
                name: true
            }
        })
         data.salesBroker = await prisma.user.findMany({
            where: {
                organization : {isBroker: true}
            },
            select: {
                id: true,
                fullName: true
            }
        })

         data.activity = await prisma.activity.findMany({
            select: {
                activityTitle: true,
            }
        })
       
        return NextResponse.json(data)
         
    // const activites = await prisma.activity.findMany({
    //     select: {
    //         id: true,
    //         createdBy: { select: { id: true, fullName: true } },
    //         createdAt: true,
    //         activityTitle: true,
    //         activityDate: true,
    //         salesPerson: { select: { id: true, fullName: true, managedBy: { select: { id: true, fullName: true, managedBy: {select: {id:true, fullName:true}} } } } },
    //         activitySource: { select: { id: true, name: true } },
    //         activityCategory: { select: { id: true, name: true } },
    //         activityType: { select: { id: true, name: true } },
    //         project: { select: { id: true, name: true } },
    //         activityUnitType: { select: { id: true, name: true } },
    //         activityLeadStatus: { select: { id: true, name: true } },
    //         activityNotInterestedReason: { select: { id: true, name: true } },
    //         clientName: true,
    //         salesBroker: { select: { id: true, fullName: true } },
    //         budget: true,
    //         contact: true,
    //         compatetior: true,
    //         leadBrokerage: true,
    //         agentBrokerage: true,
    //         Remarks: true
    //     }
    // })
    // return NextResponse.json(activites)
    }catch (error) {
        console.error("Error fetching activities:", error)
        return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })      
    }
   
    }



export async function POST(request: Request) {

    const body = await request.json()
    const {
        activityTitle,
        activityDate,
        salesPersonId,
        activitySourceId,
        activityCategoryId,
        activityTypeId,
        projectId,
        activityUnitTypeId,
        activityLeadStatusId,
        activityNotInterestedReasonId,
        clientName,
        salesBrokerId,
        budget,
        contact,
        compatetior,
        leadBrokerage,
        agentBrokerage,
        Remarks
    } = body

    try {
        // Create a data object without the optional relation first
        const activityData = { ...body,
     
            activityDate: new Date(activityDate).toISOString(), // Convert to ISO string format
            salesPerson: "6813d4ede9f801712d6b06de",
            salesBrokerId:  "6813d4ede9f801712d6b06de",
            createdBy: "6813d4ede9f801712d6b06de",
            
        };
        
        // Only add the activityNotInterestedReason relation if ID is provided
        // if (activityNotInterestedReasonId) {
        //     activityData.activityNotInterestedReason = { 
        //         connect: { id: activityNotInterestedReasonId } 
        //     };
        // }
        
        const newActivity = await prisma.activity.create( activityData
        )
        
        return NextResponse.json(newActivity)
    } catch (error) {
         console.error("Error creating new Activity:", error)
         return NextResponse.json({ error: "Failed to create new Activity" }, { status: 500 })      
    }
}
