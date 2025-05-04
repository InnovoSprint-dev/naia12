/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import {  useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { addDays, format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const FormSchema = z.object({
  activityDate: z.string().min(1, {
    message: "Activity date is required.",
  }),
  activityTitle: z.string().min(2, {
    message: "Activity title must be at least 2 characters.",
  }),
  project: z.string().min(2, {
    message: "Project is required.",
  }),
  activitySource: z.string().min(2, {
    message: "source is required.",
  }),
  activityCategory: z.string().min(2, {
    message: "category is required.",
  }),
  activityType: z.string().min(2, {
    message: "type is required.",
  }),
  activityUnitType: z.string().min(2, {
    message: "unit type is required.",
  }),
  activityLeadStatus: z.string().min(2, {
    message: "lead status is required.",
  }),
  activityNotInterestedReason: z.string().optional(),
  
  clientName: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  budget: z.string().optional(),
  contact: z.string().optional(),
  compatetior: z.string().optional(),
  Remarks: z.string().optional(),
});

export default function InputForm({dataSource}: {dataSource: any}) {
  // const { data: session, } = useSession();
  // const [date, setDate] = useState<Date>()
  // Create a separate open state for each dropdown
  const [openStates, setOpenStates] = useState({
    project: false,
    activitySource: false,
    activityCategory: false,
    activityType: false, 
    activityUnitType: false,
    activityLeadStatus: false,
    activityNotInterestedReason: false,
  });
  
  // Create a separate value state for each dropdown
  const [values, setValues] = useState({
    project: "",
    activitySource: "",
    activityCategory: "",
    activityType: "",
    activityUnitType: "",
    activityLeadStatus: "",
    activityNotInterestedReason: "",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      activityTitle: "",
      activityDate: "",
      project: "",
      activitySource: "",
      activityCategory: "",
      activityType: "",
      activityUnitType: "",
      activityLeadStatus: "",
      activityNotInterestedReason: "",
      clientName: "",
      budget: "",
      contact: "",
      compatetior: "",
      Remarks: "",
    },
  });
  
  // Helper function to toggle dropdown state
  const toggleDropdown = (fieldName: string, isOpen: boolean) => {
    setOpenStates(prev => ({
      ...prev,
      [fieldName]: isOpen
    }));
  };
  
  // Helper function to update dropdown value
  const updateValue = (fieldName: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Map form field names to API expected field names
      const apiSubmitData = {
        activityTitle: data.activityTitle,
        activityDate: data.activityDate,
        salesPersonId: "clr2b8dge000kuygqgq2u9ty3", // Default value since salesPerson field isn't in form 
        activitySourceId: data.activitySource,
        activityCategoryId: data.activityCategory,
        activityTypeId: data.activityType,
        projectId: data.project,
        activityUnitTypeId: data.activityUnitType,
        activityLeadStatusId: data.activityLeadStatus,
        activityNotInterestedReasonId: data.activityNotInterestedReason || undefined,
        clientName: data.clientName,
        salesBrokerId: "clr2b8dge000kuygqgq2u9ty3", // Default value since salesBroker field isn't in form
        budget: data.budget ? parseFloat(data.budget) : null, // Convert budget to number or null
        contact: data.contact || "",
        compatetior: data.compatetior || "",
        leadBrokerage: false, // Default values for missing fields
        agentBrokerage: false,
        Remarks: data.Remarks || ""
      };

      fetch("/api/activities/create", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiSubmitData),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        toast("Activity created successfully!", {
          description: "Your activity has been created.",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        toast("Failed to create activity", {
          description: "There was an error creating your activity.",
          // variant: "destructive",
        });
      });
    } catch (error) {
      console.error("Error:", error);
      toast("Error", {
        description: "There was an error processing your request.",
        // variant: "destructive",
      });
    }

    toast("Form submitted", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  }

  // Helper component to render a dropdown select
  const SelectField = ({ 
    name, 
    label, 
    required,
    data 
  }: { 
    name: keyof typeof values, 
    label: string, 
    required?: boolean,
    data: Array<{ id: string, name: string }> 
  }) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="grid grid-cols-2 gap-0 items-center">
            <FormLabel className="justify-start items-center">{label} {required && <span className="text-red-500 mx-0 font-black text-sm">*</span>}</FormLabel>
            <FormControl>
              <Popover 
                open={openStates[name]} 
                onOpenChange={(isOpen) => toggleDropdown(name, isOpen)}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openStates[name]}
                    className="w-full justify-between"
                  >
                    {values[name]
                      ? data.find(item => item.id === values[name])?.name
                      : `Select ${label.toLowerCase().slice(0,8)}...`}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder={`Search ${label.toLowerCase()}...`}
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {data.map((item) => (
                          <CommandItem
                            key={item.id}
                            value={item.id}
                            onSelect={(currentValue) => {
                              updateValue(name, currentValue === values[name] ? "" : currentValue);
                              toggleDropdown(name, false);
                              field.onChange(currentValue); // Update form value
                            }}
                          >
                            {item.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                values[name] === item.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="w-full ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          {/* Render all the select fields */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-5 w-full">
          <SelectField 
          
            name="project" 
            label="Project" 
            required={true}
            data={dataSource.project || []} 
          />
          
          <SelectField 
            name="activitySource" 
            label="Source" 
            data={dataSource.activitySource || []} 
          />
          
          <SelectField 
            name="activityCategory" 
            label="Category" 
            required={true}
            data={dataSource.activityCategory || []} 
          />
          
          <SelectField 
            name="activityType" 
            label="Type" 
            required={true}
            data={dataSource.activityType || []} 
          />
          
          <SelectField 
            name="activityUnitType" 
            label="Unit Type" 
            required={true}
            data={dataSource.activityUnitType || []} 
          />
          
          <SelectField 
            name="activityLeadStatus" 
            label="Lead Status" 
            required={true}
            data={dataSource.activityLeadStatus || []} 
          />
          
          <SelectField 
            name="activityNotInterestedReason" 
            label="Not Interested Reason" 
   
            data={dataSource.activityNotInterestedReason || []} 
          />




<FormField
  control={form.control}
  name="activityDate"
  render={({ field }) => (
    <FormItem className="grid grid-cols-2 gap-0 items-center">
      <FormLabel>Activity Date <span className="text-red-500 mx-0 font-black text-sm">*</span></FormLabel>
      <FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
            <Select
              onValueChange={(value) => {
                const newDate = addDays(new Date(), parseInt(value));
                field.onChange(format(newDate, "yyyy-MM-dd"));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0">Today</SelectItem>
                <SelectItem value="1">Tomorrow</SelectItem>
                <SelectItem value="3">In 3 days</SelectItem>
                <SelectItem value="7">In a week</SelectItem>
              </SelectContent>
            </Select>
            <div className="rounded-md border">
              <Calendar 
                mode="single" 
                selected={field.value ? new Date(field.value) : undefined} 
                onSelect={(date) => {
                  if (date) {
                    field.onChange(format(date, "yyyy-MM-dd"));
                  }
                }} 
              />
            </div>
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


<FormField
            control={form.control}
            name="activityTitle"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 gap-0 items-center">
                <FormLabel>Activity Title  <span className="text-red-500 mx-0 font-black text-sm">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Insert title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> 





          <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem className="grid grid-cols-2 gap-0 items-center">
              <FormLabel>Client name  <span className="text-red-500 mx-0 font-black text-sm">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Insert client name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />  <FormField
      control={form.control}
      name="budget"
      render={({ field }) => (
        <FormItem className="grid grid-cols-2 gap-0 items-center">
          <FormLabel>Budget</FormLabel>
          <FormControl>
            <Input type="number" placeholder="Insert budget" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

<FormField
        control={form.control}
        name="contact"
        render={({ field }) => (
          <FormItem className="grid grid-cols-2 gap-0 items-center">
            <FormLabel>Contact</FormLabel>
            <FormControl>
              <Input placeholder="Insert contact" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
              control={form.control}
              name="compatetior"
              render={({ field }) => (
                <FormItem className="grid grid-cols-2 gap-0 items-center">
                  <FormLabel>Compatetior</FormLabel>
                  <FormControl>
                    <Input placeholder="Insert competitor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                    control={form.control}
                    name="Remarks"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-2 gap-0 items-center">
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Input placeholder="Add remarks" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
