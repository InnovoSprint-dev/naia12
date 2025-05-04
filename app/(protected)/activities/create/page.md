
"use client";
import { useEffect, useState } from "react";


import CreateForm from "./form";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
export default function CreateActivityPage() {


  const [data, setData] = useState<{
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
    }[];
    activitySource: {
      id: string;
      name: string;
    }[];
    activityCategory: {
      id: string;
      name: string;
    }[];
    activityType: {
      id: string;
      name: string;
    }[];
    project: {
      id: string;
      name: string;
    }[];
    activityUnitType: {
      id: string;
      name: string;
    }[];
    activityLeadStatus: {
      id: string;
      name: string;
    }[];
    activityNotInterestedReason: {
      id: string;
      name: string;
    }[];
    salesBroker: {
      id: string;
      fullName: string;
    }[];
    activity: {
      title: string;
    }[];
  }>({
    salesPerson: [],
    activitySource: [],
    activityCategory: [],
    activityType: [],
    project: [],
    activityUnitType: [],
    activityLeadStatus: [],
    activityNotInterestedReason: [],
    salesBroker: [],
    activity: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/activities/create", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setData(data);
    };
    fetchData();
  }, []);

  return (
    <div className="">
        <div className="w-full p-8">
            {/* <pre>
                {JSON.stringify(session, null, 2)}
            </pre> */}
        <CreateForm  dataSource={data} />
        </div>

    
    
    </div>
  );
}
