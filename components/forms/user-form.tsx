"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Ban,
  Camera,
  ChevronLeftIcon,
  ChevronRightIcon,
  DollarSign,
  Loader2,
  MapIcon,
  ThumbsUp,
  Trophy,
  User,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { UserSurveyFormData } from "@/types/types";
import { userSurveySchema } from "@/validations/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVisitorIp } from "@/hooks/use-ip-address";
import { IpErrorCard } from "../error/IpErrorCard";
import { IpLoadingSkeleton } from "../form-loading/IpLoadingSkeleton";
import { Button } from "../ui/button";
import { useUserSurvey } from "@/hooks/use-user-survey";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

export default function UserForm() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const [currentStep, setCurrentStep] = useState<number>(0);
  const { ip, visitorId, isLoading, error: ipError, retry } = useVisitorIp();

  const userSurveySections = [
    {
      title: "Photography Consumption Habits",
      icon: <Camera className="h-5 w-5" />,
    },
    {
      title: "Willingness to Pay for Digital Downloads",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Barriers to Paying for Downloads",
      icon: <Ban className="h-5 w-5" />,
    },
    {
      title: "What Would Convince You to Pay?",
      icon: <ThumbsUp className="h-5 w-5" />,
    },
    {
      title: "Additional Engagement",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      title: "Demographic Information",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Platform Features & Location-Based Ideas",
      icon: <MapIcon className="h-5 w-5" />,
    },
  ];

  const mutation = useUserSurvey();

  const form = useForm<UserSurveyFormData>({
    resolver: zodResolver(userSurveySchema),
    defaultValues: {
      willingToPay: false,
      useCases: [],
      barriers: [],
      conversionFactors: [],
      platformFeatures: [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { handleSubmit, control, watch } = form;

  const nextStep = () => {
    if (currentStep < userSurveySections.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: UserSurveyFormData) => {
    if (visitorId) {
      const formDataWithFingerprint = {
        ...data,
        fingerprint: visitorId,
        metadata: {
          ip: ip,
          userAgent: navigator.userAgent,
        },
      };

      try {
        await mutation.mutateAsync(formDataWithFingerprint);
        form.reset();
        confetti({
          particleCount: 200,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (error) {
        console.log("Error while submitting survey data:", error);
      }
    } else {
      console.log("Error while submitting survey data");
      toast.error("something went wrong. please try again later");
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any) => {
    console.error("Form errors:", errors);

    // Show error toast for each field with errors
    Object.entries(errors).forEach(([fieldName, error]) => {
      if (error && typeof error === "object" && "message" in error) {
        toast.error(
          `Please fix the errors in the form,${fieldName}: ${error.message}`
        );
      }
    });
  };

  if (ipError) {
    return (
      <IpErrorCard
        ipError={ipError}
        handleRetry={() => retry(true)}
        isIpLoading={isLoading ?? false}
      />
    );
  }

  if (isLoading) {
    return <IpLoadingSkeleton />;
  }
  console.log("form errors:", form.formState.errors);
  return (
    <Card className="border-0 shadow-lg w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <User className="h-6 w-6" /> Help Us Find Your Perfect Photographer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <motion.form
            onSubmit={handleSubmit(onSubmit, onError)}
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Progress indicator */}
            <div className="flex justify-between items-center p-3 rounded-br-lg rounded-bl-lg mb-8 sticky top-0 bg-white z-10 shadow-md">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl cursor-pointer"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {userSurveySections.length}
              </div>
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl cursor-pointer"
                onClick={nextStep}
                disabled={currentStep === userSurveySections.length - 1}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Section 1: Photography Consumption Habits */}
            {currentStep === 0 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {userSurveySections[0].icon} {userSurveySections[0].title}
                </h3>

                <div className="space-y-6">
                  <FormField
                    control={control}
                    name="usageFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            1
                          </span>
                          How often do you download or purchase high-quality
                          photos online?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full py-5 px-4 text-base cursor-pointer">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              { value: "never", label: "Never" },
                              {
                                value: "rarely",
                                label: "Rarely (a few times a year)",
                              },
                              {
                                value: "occasionally",
                                label: "Occasionally (1–2x per month)",
                              },
                              {
                                value: "frequently",
                                label: "Frequently (weekly/monthly)",
                              },
                            ].map((option) => (
                              <SelectItem
                                key={option.value}
                                className="cursor-pointer"
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="useCases"
                    render={() => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            2
                          </span>
                          What do you typically use downloaded photos for?
                          (Select all that apply)
                        </FormLabel>
                        <div className="space-y-3 mt-3">
                          {[
                            {
                              id: "personal_use",
                              label:
                                "Personal use (wallpapers, prints at home)",
                              value: "personal_use",
                            },
                            {
                              id: "social_media",
                              label: "Social media/blogging",
                              value: "social_media",
                            },
                            {
                              id: "business",
                              label: "Business/commercial projects",
                              value: "business",
                            },
                            { id: "other_use", label: "Other", value: "other" },
                          ].map((item) => (
                            <FormField
                              key={item.id}
                              control={control}
                              name="useCases"
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        item.value
                                      )}
                                      className="h-5 w-5 cursor-pointer border-2 border-gray-300 rounded-md data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              item.value,
                                            ])
                                          : field.onChange(
                                              (field.value || []).filter(
                                                (value: string) =>
                                                  value !== item.value
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="selfPhotographyFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            3
                          </span>
                          How often do you go for photography yourself?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full py-5 px-4 text-base cursor-pointer">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              { value: "never", label: "Never" },
                              {
                                value: "rarely",
                                label: "Rarely (1–2 times a year)",
                              },
                              {
                                value: "occasionally",
                                label: "Occasionally (every few months)",
                              },
                              {
                                value: "frequently",
                                label: "Frequently (monthly or more)",
                              },
                            ].map((option) => (
                              <SelectItem
                                key={option.value}
                                className="cursor-pointer"
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
            )}

            {/* Section 2: Willingness to Pay */}
            {currentStep === 1 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {userSurveySections[1].icon} {userSurveySections[1].title}
                </h3>

                <div className="space-y-6">
                  <FormField
                    control={control}
                    name="willingToPay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            4
                          </span>
                          Would you pay for high-resolution, watermark-free
                          photos?
                        </FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === "yes")
                          }
                          defaultValue={field.value ? "yes" : "no"}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full py-5 px-4 text-base cursor-pointer">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watch("willingToPay") === true && (
                    <>
                      <FormField
                        control={control}
                        name="maxPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                              <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                                5
                              </span>
                              What&apos;s the maximum price you&apos;d pay per
                              photo?
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full py-5 px-4 text-base cursor-pointer">
                                  <SelectValue placeholder="Select price range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[
                                  {
                                    value: "ksh50-ksh100",
                                    label: "ksh 50 – ksh 100",
                                  },
                                  {
                                    value: "ksh100-ksh200",
                                    label: "ksh 100 – ksh 200",
                                  },
                                  {
                                    value: "ksh200-ksh300",
                                    label: "ksh 200 – ksh 300",
                                  },
                                  {
                                    value: "more_than_300",
                                    label: "More than ksh 300",
                                  },
                                ].map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    className="cursor-pointer"
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="paymentPreference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                              <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                                6
                              </span>
                              What payment model do you prefer?
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full py-5 px-4 text-base cursor-pointer">
                                  <SelectValue placeholder="Select payment model" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[
                                  {
                                    value: "per_photo",
                                    label: "Pay per photo",
                                  },
                                  {
                                    value: "subscription",
                                    label: "Subscription",
                                  },
                                  {
                                    value: "credits",
                                    label: "Credits/bundles",
                                  },
                                ].map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    className="cursor-pointer"
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Section 3: Barriers to Paying for Downloads */}
            {currentStep === 2 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Ban className="h-5 w-5" /> Barriers to Paying for Downloads
                </h3>

                <div className="space-y-6">
                  <FormField
                    control={control}
                    name="barriers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            7
                          </span>
                          Why wouldn&apos;t you pay for digital downloads?
                          (Select all that apply)
                        </FormLabel>
                        <div className="space-y-3 mt-3">
                          {[
                            {
                              id: "free_stock",
                              label:
                                "Prefer free stock photo sites (e.g., Unsplash, Pexels)",
                              value: "free_stock",
                            },
                            {
                              id: "no_high_res",
                              label: "Don't need high-resolution files",
                              value: "no_high_res",
                            },
                            {
                              id: "copyright",
                              label: "Worried about copyright/usage rights",
                              value: "copyright",
                            },
                            {
                              id: "price_high",
                              label: "Prices are usually too high",
                              value: "price_high",
                            },
                            {
                              id: "other_barriers",
                              label: "Other",
                              value: "other",
                            },
                          ].map((item) => (
                            <FormItem
                              key={item.id}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={(field.value || []).includes(
                                    item.value
                                  )}
                                  className="h-5 w-5 cursor-pointer border-2 border-gray-300 rounded-md data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    return checked
                                      ? field.onChange([
                                          ...currentValues,
                                          item.value,
                                        ])
                                      : field.onChange(
                                          currentValues.filter(
                                            (value: string) =>
                                              value !== item.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
            )}

            {/* Section 4: What Would Convince You to Pay? */}
            {currentStep === 3 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5" /> What Would Convince You to
                  Pay?
                </h3>

                <div className="space-y-6">
                  <FormField
                    control={control}
                    name="conversionFactors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            8
                          </span>
                          Which features would make you more likely to purchase?
                        </FormLabel>
                        <div className="space-y-3 mt-3">
                          {[
                            {
                              id: "exclusive_photos",
                              label:
                                "Exclusive/unique photos (not on free sites)",
                              value: "exclusive_photos",
                            },
                            {
                              id: "usage_rights",
                              label:
                                "Clear usage rights (e.g., commercial license)",
                              value: "usage_rights",
                            },
                            {
                              id: "discounts",
                              label: "Discounts for bulk purchases",
                              value: "discounts",
                            },
                            {
                              id: "money_back",
                              label: "Money-back guarantee",
                              value: "money_back",
                            },
                            {
                              id: "other_factors",
                              label: "Other",
                              value: "other",
                            },
                          ].map((item) => (
                            <FormItem
                              key={item.id}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={(field.value || []).includes(
                                    item.value
                                  )}
                                  className="h-5 w-5 cursor-pointer border-2 border-gray-300 rounded-md data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    return checked
                                      ? field.onChange([
                                          ...currentValues,
                                          item.value,
                                        ])
                                      : field.onChange(
                                          currentValues.filter(
                                            (value: string) =>
                                              value !== item.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Conditional "Other" explanation field */}
                  {watch("conversionFactors")?.includes("other") && (
                    <FormField
                      control={control}
                      name="conversionOtherExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                            <span className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                              +
                            </span>
                            Please specify other factors:
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter other factors that would convince you to pay"
                              className="w-full p-3 border border-gray-300 rounded-md"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </motion.div>
            )}

            {/* Section 5: Additional Engagement */}
            {currentStep === 4 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Trophy className="h-5 w-5" /> Additional Engagement
                </h3>

                <div className="space-y-6">
                  <FormField
                    control={control}
                    name="contestParticipation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            8
                          </span>
                          Would you participate in monthly photo contests
                          (voting or submitting)?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full py-5 px-4 text-base cursor-pointer">
                              <SelectValue placeholder="Select participation level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              { value: "voter", label: "Yes (as a voter)" },
                              {
                                value: "submitter",
                                label: "Yes (as a submitter, if allowed)",
                              },
                              { value: "none", label: "No" },
                            ].map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="cursor-pointer"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
            )}

            {/* Section 6: Demographic Information */}
            {currentStep === 5 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" /> Demographic Information
                </h3>

                <div className="space-y-6">
                  {/* Question 9: Age Range */}
                  <FormField
                    control={control}
                    name="ageRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            9
                          </span>
                          What is your age range?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full py-5 px-4 text-base cursor-pointer">
                              <SelectValue placeholder="Select age range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              { value: "Under 18", label: "Under 18" },
                              { value: "18-24", label: "18–24" },
                              { value: "25-34", label: "25–34" },
                              { value: "35-44", label: "35–44" },
                              { value: "45-54", label: "45–54" },
                              { value: "55+", label: "55+" },
                            ].map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="cursor-pointer"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Question 10: Occupation */}
                  <FormField
                    control={control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            10
                          </span>
                          What is your primary occupation?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full py-5 px-4 text-base cursor-pointer">
                              <SelectValue placeholder="Select occupation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              { value: "Student", label: "Student" },
                              { value: "Professional", label: "Professional" },
                              { value: "Freelancer", label: "Freelancer" },
                              {
                                value: "Artist/Creative",
                                label: "Artist/Creative",
                              },
                              { value: "Retired", label: "Retired" },
                              { value: "Other", label: "Other" },
                            ].map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="cursor-pointer"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
            )}

            {/* Section 7: Platform Features & Location-Based Ideas */}
            {currentStep === 6 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapIcon className="h-5 w-5" /> Platform Features &
                  Location-Based Ideas
                </h3>

                <div className="space-y-6">
                  {/* Question 11: Location Platform Interest */}
                  <FormField
                    control={control}
                    name="locationPlatformInterest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            11
                          </span>
                          Would you like the idea of a location-based platform
                          to choose photographers for events?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full py-5 px-4 text-base cursor-pointer">
                              <SelectValue placeholder="Select your interest level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              { value: "yes", label: "Yes" },
                              { value: "no", label: "No" },
                              { value: "maybe", label: "Maybe" },
                            ].map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="cursor-pointer"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Conditional explanation for "Maybe" response */}
                  {watch("locationPlatformInterest") === "maybe" && (
                    <FormField
                      control={control}
                      name="locationPlatformExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                            <span className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                              11a
                            </span>
                            Please explain why:
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your explanation"
                              className="w-full p-3 border border-gray-300 rounded-md"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Question 12: Platform Features */}
                  <FormField
                    control={control}
                    name="platformFeatures"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            12
                          </span>
                          What features would you like to see included in a
                          platform like this?
                        </FormLabel>
                        <div className="space-y-3 mt-3">
                          {[
                            {
                              id: "location_search",
                              label: "Search by location (city, region, etc.)",
                              value: "location_search",
                            },
                            {
                              id: "event_type_filter",
                              label:
                                "Filter by event type (weddings, corporate events, parties, etc.)",
                              value: "event_type_filter",
                            },
                            {
                              id: "reviews",
                              label: "Reviews and ratings from past clients",
                              value: "reviews",
                            },
                            {
                              id: "portfolio",
                              label: "Portfolio showcase of photographers",
                              value: "portfolio",
                            },
                            {
                              id: "price_filter",
                              label: "Price range filter",
                              value: "price_filter",
                            },
                            {
                              id: "booking_system",
                              label:
                                "Booking and payment system directly on the platform",
                              value: "booking_system",
                            },
                            {
                              id: "other_features",
                              label: "Other",
                              value: "other",
                            },
                          ].map((item) => (
                            <FormItem
                              key={item.id}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={(field.value || []).includes(
                                    item.value
                                  )}
                                  className="h-5 w-5 cursor-pointer border-2 border-gray-300 rounded-md data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    return checked
                                      ? field.onChange([
                                          ...currentValues,
                                          item.value,
                                        ])
                                      : field.onChange(
                                          currentValues.filter(
                                            (value: string) =>
                                              value !== item.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>

                        {/* Conditional "Other" explanation field */}
                        {(field.value || []).includes("other") && (
                          <FormField
                            control={control}
                            name="platformFeaturesOther"
                            render={({ field }) => (
                              <FormItem className="mt-4">
                                <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                                  <span className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                    +
                                  </span>
                                  Please specify other features:
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Enter other features you'd like to see"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
            )}

            {/* Submit button (only shown on last step) */}
            {currentStep === userSurveySections.length - 1 && (
              <motion.div variants={item} className="mt-8">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full cursor-pointer"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Survey"
                  )}
                </Button>
              </motion.div>
            )}
          </motion.form>
        </Form>
      </CardContent>
    </Card>
  );
}
