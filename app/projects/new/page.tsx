"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploader } from "@/components/FileUploader"

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  budget: z.string().refine((val) => !Number.isNaN(Number.parseInt(val, 10)), {
    message: "Please enter a valid number for the budget.",
  }),
  targetedOutcome: z.string().min(10, {
    message: "Targeted outcome must be at least 10 characters.",
  }),
  sdgAlignment: z.string({
    required_error: "Please select an SDG alignment.",
  }),
})

export default function NewProject() {
  const [files, setFiles] = useState<File[]>([])
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      description: "",
      budget: "",
      targetedOutcome: "",
      sdgAlignment: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send the form data and files to your backend
    console.log(values, files)
    // Redirect to the projects page after creation
    router.push("/projects")
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto border-2 border-primary/20">
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-primary">Create New Project</CardTitle>
          <CardDescription>Enter the details for your new CSR project</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} className="border-primary/20" />
                    </FormControl>
                    <FormDescription>This is the name of your CSR project.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your CSR project"
                        className="resize-none border-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Provide a brief description of your CSR project.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter project budget"
                        {...field}
                        className="border-primary/20"
                      />
                    </FormControl>
                    <FormDescription>Enter the allocated budget for this project.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetedOutcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Targeted Outcome</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the targeted outcome"
                        className="resize-none border-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>What is the expected outcome of this CSR project?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sdgAlignment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SDG Alignment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-primary/20">
                          <SelectValue placeholder="Select an SDG" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sdg1">SDG 1: No Poverty</SelectItem>
                        <SelectItem value="sdg2">SDG 2: Zero Hunger</SelectItem>
                        <SelectItem value="sdg3">SDG 3: Good Health and Well-being</SelectItem>
                        {/* Add more SDGs as needed */}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the primary SDG that this project aligns with.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FileUploader files={files} setFiles={setFiles} />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Create Project
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

