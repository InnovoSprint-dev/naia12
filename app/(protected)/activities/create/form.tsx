/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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
import { Input } from "@/components/ui/input";

import { Check, ChevronsUpDown } from "lucide-react";

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
  title: z.string().min(2, {
    message: "Username must be at least 2 characters.",
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
      title: "",
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
    data 
  }: { 
    name: keyof typeof values, 
    label: string, 
    data: Array<{ id: string, name: string }> 
  }) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="grid grid-cols-2 gap-0 items-center">
            <FormLabel className="justify-start items-center">{label}</FormLabel>
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
            data={dataSource.activityCategory || []} 
          />
          
          <SelectField 
            name="activityType" 
            label="Type" 
            data={dataSource.activityType || []} 
          />
          
          <SelectField 
            name="activityUnitType" 
            label="Unit Type" 
            data={dataSource.activityUnitType || []} 
          />
          
          <SelectField 
            name="activityLeadStatus" 
            label="Lead Status" 
            data={dataSource.activityLeadStatus || []} 
          />
          
          <SelectField 
            name="activityNotInterestedReason" 
            label="Not Interested Reason" 
            data={dataSource.activityNotInterestedReason || []} 
          />

<FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 gap-0 items-center">
                <FormLabel>Activity Title</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
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
              <FormLabel>Client name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
            <Input type="number" placeholder="shadcn" {...field} />
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
              <Input placeholder="shadcn" {...field} />
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
                    <Input placeholder="shadcn" {...field} />
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
                          <Input placeholder="shadcn" {...field} />
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
