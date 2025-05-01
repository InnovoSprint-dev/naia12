/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma'


interface Activity {
    id    :      string, 
    createdBy :{id: string, fullName: string},
    createdAt: Date, 
activityTitle: string,
    activityDate:  Date,
    salesPerson : {id: string, fullName: string},
    activitySource  : {id: string, name: string},
    activityCategory : {id: string, name: string},
    activityType  : {id: string, name: string},
    project   : {id: string, name: string},

    activityUnitType  : {id: string, name: string},
    activityLeadStatus  : {id: string, name: string},
    activityNotInterestedReason  : {id: string, name: string},
    clientName :string
    salesBroker: {id: string, fullName: string},
    budget    :    Float16Array,
    contact    :    string,
    compatetior :   string,
    leadBrokerage : boolean,
    agentBrokerage: boolean,
    Remarks       : string,

}


export async function POST(request: Request) {
    const body = await request.json()
    try{
         const {  email } = body
    const activites = await prisma.activity.findMany({
        select: {
            id: true,
            createdBy: { select: { id: true, fullName: true } },
            createdAt: true,
            activityTitle: true,
            activityDate: true,
            salesPerson: { select: { id: true, fullName: true, managedBy: { select: { id: true, fullName: true, managedBy: {select: {id:true, fullName:true}} } } } },
            activitySource: { select: { id: true, name: true } },
            activityCategory: { select: { id: true, name: true } },
            activityType: { select: { id: true, name: true } },
            project: { select: { id: true, name: true } },
            activityUnitType: { select: { id: true, name: true } },
            activityLeadStatus: { select: { id: true, name: true } },
            activityNotInterestedReason: { select: { id: true, name: true } },
            clientName: true,
            salesBroker: { select: { id: true, fullName: true } },
            budget: true,
            contact: true,
            compatetior: true,
            leadBrokerage: true,
            agentBrokerage: true,
            Remarks: true
        }
    })
    return NextResponse.json(activites)
    }catch (error) {
        console.error("Error fetching activities:", error)
        return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })      
    }
   
    }