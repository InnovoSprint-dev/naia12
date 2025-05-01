
"use client";

import { useEffect, useState } from "react";
import TableData from "./table";

// Example activity type matching the API response
type Activity = {
  id: string;
  createdBy: { id: string; fullName: string };
  createdAt: string | Date;
  activityTitle: string;
  activityDate: string | Date;
  salesPerson: {
    id: string;
    fullName: string;
    managedBy?: {
      id: string;
      fullName: string;
      managedBy?: {
        id: string;
        fullName: string;
      };
    };
  };
  activitySource: { id: string; name: string };
  activityCategory: { id: string; name: string };
  activityType: { id: string; name: string };
  project: { id: string; name: string };
  activityUnitType: { id: string; name: string };
  activityLeadStatus: { id: string; name: string };
  activityNotInterestedReason: { id: string; name: string };
  clientName: string;
  salesBroker: { id: string; fullName: string };
  budget: number;
  contact: string;
  compatetior: string;
  leadBrokerage: boolean;
  agentBrokerage: boolean;
  Remarks: string;
};

export default function ActivitiesPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Activity[]>([]);


  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/api/activities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "super.admin@naiadevelopments.com" }),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch activities');
        }

        const activities = await res.json();
        setData(activities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    handler();
  }, []);

  return (
    <div className="container mx-auto p-8 ">
      <h1 className="text-3xl font-bold mb-2">Activities</h1>
      <p className="text-muted-foreground mb-8">Manage and track all sales activities</p>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading activities...</p>
        </div>
      ) : (
        <div>
          <TableData data={data} />
          {/* <pre>
            {JSON.stringify(data, null, 2)}
          </pre> */}
        </div>
      )}
    </div>
  );
}
