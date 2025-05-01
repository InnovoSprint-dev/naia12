"use client";
import * as React from "react";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }), 
    password: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),
})

export default function CardWithForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "super.admin@naiadevelopments.com",
      password: "12345678"
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await signIn("credentials", data);
    toast("Login attempt", {
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

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-2/3 space-y-6"
      >
        <Card className="w-sm md:w-md bg-white shadow-2xl ">
        <CardHeader className="flex flex-col md:flex-row justify-center items-center gap-10">
          <Image src="/img/naia1.png" alt="naia logo" width={70} height={35} />
         
          <div className="flex-1 md:border-s border-s-slate-700/50 md:ps-8">
            
 <CardTitle className="text-center md:text-left">Sign in</CardTitle>
          <CardDescription>Naia Development Application.</CardDescription>

          </div>
         
        </CardHeader>



          {/* <CardHeader>
            <CardTitle>Login form</CardTitle>
            <CardDescription>
              Sign in to your account
            </CardDescription>
          </CardHeader> */}
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button className="w-full flex items-center justify-center gap-2" type="submit">Login</Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle className="h-5 w-5" />
                <span>Sign in with Google</span>
              </Button>

            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2  justify-center items-center">
              
            {/* <Button variant="outline">Cancel</Button>
            <Button type="submit">Login</Button> */}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
