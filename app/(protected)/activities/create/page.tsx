/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import {  useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect } from "react"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { useToast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar"

type ActivitySourceType = {
  id: string
  name: string
}

type ActivityCategoryType = {
  id: string
  name: string
}

type ActivityTypeType = {
  id: string
  name: string
}

type ProjectType = {
  id: string
  name: string
}

type ActivityUnitTypeType = {
  id: string
  name: string
}

type ActivityLeadStatusType = {
  id: string
  name: string
}

type ActivityNotInterestedReasonType = {
  id: string
  name: string
}

type UserType = {
  id: string
  fullName: string
  firstName?: string
  lastName?: string
}

const activityFormSchema = z.object({
  activityTitle: z.string().min(2, {
    message: "Activity title must be at least 2 characters.",
  }),
  activityDate: z.date({
    required_error: "Please select a date.",
  }),
  activitySourceId: z.string({
    required_error: "Please select an activity source.",
  }),
  activityCategoryId: z.string({
    required_error: "Please select an activity category.",
  }),
  activityTypeId: z.string({
    required_error: "Please select an activity type.",
  }),
  projectId: z.string({
    required_error: "Please select a project.",
  }),
  activityUnitTypeId: z.string({
    required_error: "Please select an activity unit type.",
  }),
  activityLeadStatusId: z.string({
    required_error: "Please select a lead status.",
  }),
  activityNotInterestedReasonId: z.string().optional(),
  clientName: z.string().optional(),
  salesPersonId: z.string({
    required_error: "Please select a sales person.",
  }),
  salesBrokerId: z.string().optional(),
  budget: z.union([
    z.string().transform((val) => val ? parseFloat(val) : undefined),
    z.number().optional(),
    z.undefined()
  ]),
  contact: z.string().optional(),
  compatetior: z.string().optional(),
  leadBrokerage: z.boolean().default(false),
  agentBrokerage: z.boolean().default(false),
  Remarks: z.string().optional(),
})

export default function ActivityCreatePage() {
    const  session = useSession();
    const toast = useToast()
  const router = useRouter()
  const [activitySources, setActivitySources] = useState<ActivitySourceType[]>([])
  const [activityCategories, setActivityCategories] = useState<ActivityCategoryType[]>([])
  const [activityTypes, setActivityTypes] = useState<ActivityTypeType[]>([])
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [activityUnitTypes, setActivityUnitTypes] = useState<ActivityUnitTypeType[]>([])
  const [activityLeadStatuses, setActivityLeadStatuses] = useState<ActivityLeadStatusType[]>([])
  const [activityNotInterestedReasons, setActivityNotInterestedReasons] = useState<ActivityNotInterestedReasonType[]>([])
  const [salesPersons, setSalesPersons] = useState<UserType[]>([])
  const [salesBrokers, setSalesBrokers] = useState<UserType[]>([])
  
  const form = useForm<z.infer<typeof activityFormSchema>>({
    resolver: zodResolver(activityFormSchema) as any, // Use type assertion to avoid the resolver conflict
    defaultValues: {
      activityTitle: "",
      activityDate: new Date(),
      clientName: "",
      budget: undefined,
      contact: "",
      compatetior: "",
      leadBrokerage: false,
      agentBrokerage: false,
      Remarks: "",
    },
  })

  useEffect(() => {
    // Fetch activity sources
    fetch('/api/activities/sources')
      .then(res => res.json())
      .then(data => setActivitySources(data))
      .catch(err => console.error("Failed to fetch activity sources", err))

    // Fetch activity categories
    fetch('/api/activities/categories')
      .then(res => res.json())
      .then(data => setActivityCategories(data))
      .catch(err => console.error("Failed to fetch activity categories", err))

    // Fetch activity types
    fetch('/api/activities/types')
      .then(res => res.json())
      .then(data => setActivityTypes(data))
      .catch(err => console.error("Failed to fetch activity types", err))

    // Fetch projects
    fetch('/api/activities/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Failed to fetch projects", err))

    // Fetch activity unit types
    fetch('/api/activities/unit-types')
      .then(res => res.json())
      .then(data => setActivityUnitTypes(data))
      .catch(err => console.error("Failed to fetch activity unit types", err))

    // Fetch activity lead statuses
    fetch('/api/activities/lead-statuses')
      .then(res => res.json())
      .then(data => setActivityLeadStatuses(data))
      .catch(err => console.error("Failed to fetch activity lead statuses", err))

    // Fetch activity not interested reasons
    fetch('/api/activities/not-interested-reasons')
      .then(res => res.json())
      .then(data => setActivityNotInterestedReasons(data))
      .catch(err => console.error("Failed to fetch activity not interested reasons", err))

    // Fetch users (for sales persons)
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setSalesPersons(data)
        setSalesBrokers(data)
        
        // If we have users, set a default salesperson and broker
        if (data && data.length > 0) {
          // Only set defaults if values are not already set
          if (!form.getValues('salesPersonId')) {
            form.setValue('salesPersonId', session.data?.user.id || data[0].id);
          }
        //   if (!form.getValues('salesBrokerId')) {
        //     form.setValue('salesBrokerId', data[0].id);
        //   }
        }
      })
      .catch(err => console.error("Failed to fetch users", err))
  }, [form, session])

  async function onSubmit(data: z.infer<typeof activityFormSchema>) {
    try {
      const response = await fetch('/api/activities/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create activity')
      }

       await response.json()
      
      toast(`Activity "${data.activityTitle}" has been created successfully.`)
      
      router.push('/activities')
    } catch (error) {
      console.error('Error creating activity:', error)
    
      toast(`Failed to create activity: ${error instanceof Error ? error.message : "Unknown error occurred"}`)
    }
  }
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create New Activity</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

       <h2 className="text-teal-700 font-bold">General Data</h2>

          <div className="grid grid-cols-1 ms-3 md:grid-cols-2 gap-6 border border-gray-300 p-4 rounded-md">

            {/* Activity Title */}
            <FormField
              control={form.control}
              name="activityTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter activity title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Activity Date */}
            <FormField
              control={form.control}
              name="activityDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Activity Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Activity Source */}
            <FormField
              control={form.control}
              name="activitySourceId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Activity Source</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? activitySources.find(
                                (source) => source.id === field.value
                              )?.name
                            : "Select source"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search source..." />
                        <CommandList>
                          <CommandEmpty>No source found.</CommandEmpty>
                          <CommandGroup>
                            {activitySources.map((source) => (
                              <CommandItem
                                value={source.name}
                                key={source.id}
                                onSelect={() => {
                                  form.setValue("activitySourceId", source.id)
                                }}
                              >
                                {source.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    source.id === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Activity Category */}
            <FormField
              control={form.control}
              name="activityCategoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Activity Category</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? activityCategories.find(
                                (category) => category.id === field.value
                              )?.name
                            : "Select category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {activityCategories.map((category) => (
                              <CommandItem
                                value={category.name}
                                key={category.id}
                                onSelect={() => {
                                  form.setValue("activityCategoryId", category.id)
                                }}
                              >
                                {category.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    category.id === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Activity Type */}
            <FormField
              control={form.control}
              name="activityTypeId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Activity Type</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? activityTypes.find(
                                (type) => type.id === field.value
                              )?.name
                            : "Select type"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search type..." />
                        <CommandList>
                          <CommandEmpty>No type found.</CommandEmpty>
                          <CommandGroup>
                            {activityTypes.map((type) => (
                              <CommandItem
                                value={type.name}
                                key={type.id}
                                onSelect={() => {
                                  form.setValue("activityTypeId", type.id)
                                }}
                              >
                                {type.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    type.id === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />

             {/* Sales Person */}
             <FormField
              control={form.control}
              name="salesPersonId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Sales Person</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? salesPersons.find(
                                (person) => person.id === field.value
                              )?.fullName
                            : "Select sales person"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search sales person..." />
                        <CommandList>
                          <CommandEmpty>No person found.</CommandEmpty>
                          <CommandGroup>
                            {salesPersons.map((person) => (
                              <CommandItem
                                value={person.fullName}
                                key={person.id}
                                onSelect={() => {
                                  form.setValue("salesPersonId", person.id)
                                }}
                              >
                                {person.fullName || `${person.firstName} ${person.lastName}`}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    person.id === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />

</div>
<h2 className="text-teal-700 font-bold">Unit data</h2>

<div className="grid grid-cols-1 ms-3 md:grid-cols-2 gap-6 border border-gray-300 p-4 rounded-md">

            {/* Project */}
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Project</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? projects.find(
                                (project) => project.id === field.value
                              )?.name
                            : "Select project"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search project..." />
                        <CommandList>
                          <CommandEmpty>No project found.</CommandEmpty>
                          <CommandGroup>
                            {projects.map((project) => (
                              <CommandItem
                                value={project.name}
                                key={project.id}
                                onSelect={() => {
                                  form.setValue("projectId", project.id)
                                }}
                              >
                                {project.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    project.id === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Activity Unit Type */}
            <FormField
              control={form.control}
              name="activityUnitTypeId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Activity Unit Type</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? activityUnitTypes.find(
                                (unitType) => unitType.id === field.value
                              )?.name
                            : "Select unit type"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search unit type..." />
                        <CommandList>
                          <CommandEmpty>No unit type found.</CommandEmpty>
                          <CommandGroup>
                            {activityUnitTypes.map((unitType) => (
                              <CommandItem
                                value={unitType.name}
                                key={unitType.id}
                                onSelect={() => {
                                  form.setValue("activityUnitTypeId", unitType.id)
                                }}
                              >
                                {unitType.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    unitType.id === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />



</div>
<h2 className="text-teal-700 font-bold">Client data</h2>

<div className="grid grid-cols-1 ms-3 md:grid-cols-2 gap-6 border border-gray-300 p-4 rounded-md">
          

           

            {/* Client Name */}
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

           

         

            {/* Budget */}
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter budget" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact */}
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact information" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Competitor */}
            <FormField
              control={form.control}
              name="compatetior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competitor (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter competitor information" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            
</div>
<h2 className="text-teal-700 font-bold">Lead data</h2>

<div className="grid grid-cols-1 ms-3 md:grid-cols-2 gap-6 border border-gray-300 p-4 rounded-md">


  {/* Activity Lead Status */}
  <FormField
              control={form.control}
              name="activityLeadStatusId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Lead Status</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? activityLeadStatuses.find(
                                (status) => status.id === field.value
                              )?.name
                            : "Select lead status"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search lead status..." />
                        <CommandList>
                          <CommandEmpty>No lead status found.</CommandEmpty>
                          <CommandGroup>
                            {activityLeadStatuses.map((status) => (
                              <CommandItem
                                value={status.name}
                                key={status.id}
                                onSelect={() => {
                                  form.setValue("activityLeadStatusId", status.id)
                                }}
                              >
                                {status.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    status.id === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />

             {/* Activity Not Interested Reason (optional) */}
             <FormField
              control={form.control}
              name="activityNotInterestedReasonId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Not Interested Reason (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? activityNotInterestedReasons.find(
                                (reason) => reason.id === field.value
                              )?.name
                            : "Select reason (optional)"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search reason..." />
                        <CommandList>
                          <CommandEmpty>No reason found.</CommandEmpty>
                          <CommandGroup>
                            {activityNotInterestedReasons.map((reason) => (
                              <CommandItem
                                value={reason.name}
                                key={reason.id}
                                onSelect={() => {
                                  form.setValue("activityNotInterestedReasonId", reason.id)
                                }}
                              >
                                {reason.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    reason.id === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />
            

</div>
<h2 className="text-teal-700 font-bold">Broker / Agent data</h2>

<div className="grid grid-cols-1 ms-3 md:grid-cols-2 gap-6 border border-gray-300 p-4 rounded-md">

            {/* Lead Brokerage */}
            <FormField
              control={form.control}
              name="leadBrokerage"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Lead Brokerage
                    </FormLabel>
                    <FormDescription>
                      Check if this is a lead brokerage activity
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Agent Brokerage */}
            <FormField
              control={form.control}
              name="agentBrokerage"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Agent Brokerage
                    </FormLabel>
                    <FormDescription>
                      Check if this is an agent brokerage activity
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />


               {/* Sales Broker */}
               <FormField
              control={form.control}
              name="salesBrokerId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Sales Broker</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? salesBrokers.find(
                                (broker) => broker.id === field.value
                              )?.fullName
                            : "Select sales broker"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search sales broker..." />
                        <CommandList>
                          <CommandEmpty>No broker found.</CommandEmpty>
                          <CommandGroup>
                            {salesBrokers.map((broker) => (
                              <CommandItem
                                value={broker.fullName || `${broker.firstName} ${broker.lastName}`}
                                key={broker.id}
                                onSelect={() => {
                                  form.setValue("salesBrokerId", broker.id)
                                }}
                              >
                                {broker.fullName || `${broker.firstName} ${broker.lastName}`}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    broker.id === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Remarks */}
          <FormField
            control={form.control}
            name="Remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter additional remarks or notes"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Create Activity</Button>
        </form>
      </Form>
    </div>
  )
}