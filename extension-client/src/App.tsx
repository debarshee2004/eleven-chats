import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import useLocalStorage from "./hooks/useLocalStorage";

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
const SubmitPopupForm = (data: FormData) => {
  console.log("Form submitted with data:", data);

  // Get localStorage functions
  const { setItem, updateItem, hasKey } = useLocalStorage();

  // Store or update API Key and Model in local storage
  if (hasKey("apiKey") !== false) {
    updateItem<string>("apiKey", data.apiKey); // update
  } else {
    setItem<string>("apiKey", data.apiKey); // create
  }

  if (hasKey("model") !== false) {
    updateItem<string>("model", data.model); // update
  } else {
    setItem<string>("model", data.model); // create
  }
};

const PopUp: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfiguredMessage, setShowConfiguredMessage] = useState(false);
  const { getItem, hasKey } = useLocalStorage();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      model: "",
      termsAccepted: false,
    },
  });

  // Check if API Key and Model are already configured
  useEffect(() => {
    const apiKeyExists = hasKey("apiKey");
    const modelExists = hasKey("model");

    if (apiKeyExists && modelExists) {
      // Configuration exists
      setIsConfigured(true);
      setShowConfiguredMessage(true);

      // Pre-fill form with existing values
      const apiKey = getItem<string>("apiKey") || "";
      const model = getItem<string>("model") || "";

      form.setValue("apiKey", apiKey);
      form.setValue("model", model);
    }
  }, [form, hasKey, getItem]);

  // Update form submission with loading state and success message
  const handleFormSubmit = (data: FormData) => {
    console.log("Form submitted!", data);
    setIsSubmitting(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      SubmitPopupForm(data);
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
  const models = [{ id: "mistral-large-latest", label: "Mistral Large" }];

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 w-[400px] bg-black text-white shadow-lg">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">ELEVEN CHATS</h1>
          <p className="text-gray-400">
            Setup your API key and select a model to get started.
          </p>
        </div>

        {showConfiguredMessage && isConfigured && (
          <div className="bg-white/10 border border-white/30 text-white p-4 rounded-md relative">
            <button
              className="absolute top-2 right-2 text-white/70 hover:text-white"
              onClick={() => setShowConfiguredMessage(false)}
            >
              ✕
            </button>
            <div className="flex items-center mb-2">
              <span className="bg-green-500 rounded-full p-1 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="font-medium">Configuration detected</span>
            </div>
            <p className="text-sm text-white/80">
              Your API key and model preferences are already configured. You can
              modify them below if needed.
            </p>
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-500/20 border border-green-500 text-green-500 p-3 rounded-md text-center transition-all">
            Setup completed successfully!
          </div>
        )}

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
              ) : isConfigured ? (
                "Update Configuration"
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
