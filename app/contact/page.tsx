"use client";
import { Mail, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormData } from "@/types/types";
import { contactSchema } from "@/validations/validation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      setIsLoading(true);
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();
      console.log(result);
      toast.success("Message sent successfully!");
      form.reset();
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.error("Request timed out:", error);
        toast.error("Request timed out. Please try again later.");
      } else if (error instanceof Error) {
        console.error("Error submitting form:", error);
        toast.error("Error sending message. Please try again later.");
      } else {
        console.error("Unexpected error:", error);
        toast.error("Unexpected error occurred. Please try again later.");
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = !form.formState.isValid || isLoading;
  
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Background Image with Overlay - Now with fixed height on mobile */}
      <div className="lg:w-1/2 h-[400px] lg:h-auto relative">
        <div
          className="absolute inset-0 bg-[url('/images/survey-bg.jpg')] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/survey-bg.jpg')",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="h-full flex flex-col justify-center p-6 lg:p-12 text-white"
          >
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-4 lg:p-6">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl lg:text-4xl font-extrabold text-white drop-shadow-md">
                  Get in Touch
                </CardTitle>
                <CardDescription className="text-white/70 mt-2 text-sm lg:text-base">
                  We're here to help with any questions you have.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 lg:space-y-6 mt-2 lg:mt-4">
                <div className="bg-white/5 rounded-lg p-3 lg:p-4 hover:bg-white/10 transition">
                  <h3 className="text-base lg:text-lg font-semibold text-white mb-1">
                    Our Office
                  </h3>
                  <p className="text-xs lg:text-sm text-white/70">416,50204-kimilili</p>
                </div>

                <div className="bg-white/5 rounded-lg p-3 lg:p-4 hover:bg-white/10 transition">
                  <h3 className="text-base lg:text-lg font-semibold text-white mb-1">
                    Email Us
                  </h3>
                  <p className="text-xs lg:text-sm text-white/70">info@tevinly.com</p>
                </div>

                <div className="bg-white/5 rounded-lg p-3 lg:p-4 hover:bg-white/10 transition">
                  <h3 className="text-base lg:text-lg font-semibold text-white mb-1">
                    Call Us
                  </h3>
                  <p className="text-xs lg:text-sm text-white/70">+254 (796) 268-817</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Contact Form */}
      <div className="lg:w-1/2 p-6 lg:p-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="bg-blue-100/50 p-3 rounded-full w-max mx-auto">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Contact Us
              </CardTitle>
              <CardDescription className="text-center">
                Fill out the form and we'll get back to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <motion.form
                  onSubmit={form.handleSubmit(onSubmit)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  {/* Form fields remain the same */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            className="py-3 px-4 h-13"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            {...field}
                            className="py-3 px-4 h-13"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Type your message here..."
                            className="min-h-[120px] py-3 px-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <motion.button
                    type="submit"
                    disabled={isSubmitDisabled}
                    whileHover={{ scale: isSubmitDisabled ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitDisabled ? 1 : 0.98 }}
                    className="w-full cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:pointer-events-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </motion.form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}