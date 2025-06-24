import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

// Define form schema with zod
const formSchema = z.object({
  apiKey: z.string().min(1, { message: "API Key is required" }),
  model: z.string().min(1, { message: "Please select a model" }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormData = z.infer<typeof formSchema>;

// Function to submit the form data
const submitPopupForm = (data: FormData) => {
  console.log("Form submitted with data:", data);
  // Here you would typically send the data to your extension's background script or API
};

const PopUp: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      model: "",
      termsAccepted: false,
    },
  });

  // Update form submission with loading state and success message
  const handleFormSubmit = (data: FormData) => {
    console.log("Form submitted!", data);
    setIsSubmitting(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      submitPopupForm(data);
      setShowSuccess(true);
      form.reset();
      setIsSubmitting(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Define models as key-value object array
  const models = [
    { id: "gpt-4", label: "GPT-4" },
    { id: "gpt-3.5", label: "GPT-3.5" },
    { id: "claude-3", label: "Claude 3" },
    { id: "gemini", label: "Gemini" },
    { id: "mistral-large-latest", label: "Mistral Large" },
    { id: "mistral-7b", label: "Mistral 7B" },
    { id: "mixtral-8x7b", label: "Mixtral 8x7B" },
    { id: "llama-3", label: "LLaMA 3" },
    { id: "xgen-7b", label: "XGen 7B" },
    { id: "command-r+", label: "Cohere Command R+" },
    { id: "palm-2", label: "PaLM 2" },
    { id: "jurassic-2", label: "Jurassic-2" },
  ];

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 w-[400px] bg-black text-white rounded-lg shadow-lg">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Extension Setup</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your API key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your API key for authentication
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the AI model you want to use
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Accept terms and conditions</FormLabel>
                    <FormDescription>
                      You agree to our Terms of Service and Privacy Policy.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showSuccess && (
              <div className="bg-green-500/20 border border-green-500 text-green-500 p-3 rounded-md text-center transition-all">
                Setup completed successfully!
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PopUp;
