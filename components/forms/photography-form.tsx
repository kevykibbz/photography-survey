"use client";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Loader2,
  Globe,
  Heart,
  DollarSign,
  AlertCircle,
  Zap,
  Users,
  Lightbulb,
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhotographerFormData } from "@/types/types";
import { photographerSchema } from "@/validations/validation";
import { usePhotographerSurvey } from "@/hooks/use-photographer-survey";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useVisitorIp } from "@/hooks/use-ip-address";
import { IpErrorCard } from "../error/IpErrorCard";
import { IpLoadingSkeleton } from "../form-loading/IpLoadingSkeleton";
import toast from "react-hot-toast";

const formSections = [
  {
    title: "Professional Background",
    icon: <Camera className="h-5 w-5" />,
  },
  {
    title: "Current Online Presence",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    title: "Interest in Platform",
    icon: <Heart className="h-5 w-5" />,
  },
  {
    title: "Monetization & Pricing",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    title: "Concerns & Suggestions",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    title: "Additional Features",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Collaboration Preferences",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Feature Requests & Ideas",
    icon: <Lightbulb className="h-5 w-5" />,
  },
];

export default function PhotographyForm() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const {
    ip,
    visitorId,
    isLoading: isIpLoading,
    isFetching,
    error: ipError,
    retry,
  } = useVisitorIp();
  
  const form = useForm<PhotographerFormData>({
    resolver: zodResolver(photographerSchema),
    defaultValues: {
      specialty: undefined,
      experienceYears: undefined,
      currentPlatforms: [],
      sellingPlatforms: [],
      sellingPlatformsOther: "",
      interests: {
        showcase: 3,
        sell: 3,
        discovery: 3,
        contests: 3,
      },
      premiumFeatures: {
        featured: 3,
        storage: 3,
        contestEntries: 3,
      },
      commissionAcceptance: undefined,
      concerns: [],
      featureRequests: [],
      featureRequestsOther: "",
      collaborationPrefs: [],
      additionalFeatureOpinions: {
        desiredFeatures: "",
        importance: undefined,
        willingToPay: false,
      },
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const mutation = usePhotographerSurvey();

  const onSubmit = async (data: PhotographerFormData) => {
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
    Object.entries(errors).forEach(([fieldName, error]) => {
      if (error && typeof error === "object" && "message" in error) {
        toast.error(
          `Please fix the errors in the form,${fieldName}: ${error.message}`
        );
      }
    });
  };
  const nextStep = () => {
    if (currentStep < formSections.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (ipError) {
    return (
      <IpErrorCard
        ipError={ipError}
        handleRetry={() => retry()}
        isIpLoading={isFetching ?? false}
      />
    );
  }

  if (isIpLoading) {
    return <IpLoadingSkeleton />;
  }

  return (
    <Card className="border-0 shadow-lg w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Camera className="h-6 w-6" /> Photographer Survey
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <motion.form
            onSubmit={form.handleSubmit(onSubmit, onError)}
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
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {formSections.length}
              </div>
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl cursor-pointer"
                onClick={nextStep}
                disabled={currentStep === formSections.length - 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Section 1: Professional Background */}
            {currentStep === 0 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {formSections[0].icon} {formSections[0].title}
                </h3>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            1
                          </span>
                          Specialty
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full py-5 px-4 cursor-pointer text-base">
                              <SelectValue placeholder="Select your specialty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="mt-1 py-1 shadow-lg rounded-lg border border-gray-200 bg-white">
                            {[
                              {
                                value: "Wedding",
                                label: "Wedding Photography",
                              },
                              {
                                value: "Portrait",
                                label: "Portrait Photography",
                              },
                              {
                                value: "Landscape",
                                label: "Landscape Photography",
                              },
                              { value: "Events", label: "Event Photography" },
                              {
                                value: "Commercial",
                                label: "Commercial Photography",
                              },
                              { value: "Other", label: "Other Specialty" },
                            ].map((item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                                className="py-3 px-4 cursor-pointer text-base hover:bg-blue-50 active:bg-blue-100 transition-colors"
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Experience Years Field */}
                  <FormField
                    control={form.control}
                    name="experienceYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-3 text-lg font-medium text-gray-800">
                          <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                            2
                          </span>
                          Years of Experience
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full py-5 px-4 text-base cursor-pointer">
                              <SelectValue placeholder="Select your experience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              { value: "<1", label: "Less than 1 year" },
                              { value: "1-3", label: "1-3 years" },
                              { value: "3-5", label: "3-5 years" },
                              { value: "5+", label: "5+ years" },
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

            {/* Section 2: Current Online Presence */}
            {currentStep === 1 && (
              <motion.div variants={item} className="space-y-8">
                <h3 className="text-xl font-semibold flex items-center gap-3">
                  {formSections[1].icon} {formSections[1].title}
                </h3>

                <div className="space-y-8">
                  {/* Showcase Work Section */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="currentPlatforms"
                      render={() => (
                        <FormItem>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                              3
                            </span>
                            <FormLabel className="text-base font-medium">
                              Where do you showcase your work? (Select all)
                            </FormLabel>
                          </div>
                          <div className="space-y-4 mt-3">
                            {[
                              { id: "facebook", label: "Facebook" },
                              { id: "instagram", label: "Instagram" },
                              { id: "500px-flickr", label: "500px/Flickr" },
                              {
                                id: "personal-website",
                                label: "Personal website",
                              },
                              { id: "other-showcase", label: "Other" },
                            ].map((platform) => (
                              <FormField
                                key={platform.id}
                                control={form.control}
                                name="currentPlatforms"
                                render={({ field }) => (
                                  <FormItem
                                    key={platform.id}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          platform.label
                                        )}
                                        className="h-5 w-5 cursor-pointer border-2 border-gray-300 rounded-md data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                platform.label,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value: string) =>
                                                    value !== platform.label
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="flex items-center gap-3 text-base font-normal">
                                      <span className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                        {platform.label[0]}
                                      </span>
                                      {platform.label}
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
                  </div>

                  {/* Sell Photos Section */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="sellingPlatforms"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                              4
                            </span>
                            <FormLabel className="text-base font-medium">
                              Do you sell photos online?
                            </FormLabel>
                          </div>
                          <RadioGroup
                            onValueChange={(value) => field.onChange([value])}
                            defaultValue={field.value?.[0]}
                            className="space-y-4 mt-3"
                          >
                            {[
                              { id: "sell-no", value: "No", label: "No" },
                              { id: "sell-yes", value: "Yes", label: "Yes" },
                            ].map((option) => (
                              <FormItem
                                key={option.id}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={option.value}
                                    className="h-5 w-5 cursor-pointer border-2 border-gray-300 rounded-md data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Section 3: Interest in Platform */}
            {currentStep === 2 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {formSections[2].icon} {formSections[2].title}
                </h3>

                <div className="space-y-8">
                  {[
                    {
                      name: "showcase" as const,
                      label: "Showcase your portfolio",
                    },
                    {
                      name: "sell" as const,
                      label: "Sell prints/digital downloads",
                    },
                    {
                      name: "discovery" as const,
                      label: "Get discovered by local clients",
                    },
                    {
                      name: "contests" as const,
                      label: "Compete in contests for cash prizes",
                    },
                  ].map((item, index) => (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={`interests.${item.name}`}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                            <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                              {index + 5}
                            </span>
                            {item.label} (1-5 scale)
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-1">
                              <div className="text-sm text-gray-700 font-medium">
                                Scale: {field.value ?? 3}
                              </div>
                              <Slider
                                value={[field.value ?? 3]}
                                onValueChange={(val) => field.onChange(val[0])}
                                min={1}
                                max={5}
                                step={1}
                                className="cursor-pointer"
                              />
                            </div>
                          </FormControl>

                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Not Interested</span>
                            <span>Very Interested</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section 4: Monetization & Pricing */}
            {currentStep === 3 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {formSections[3].icon} {formSections[3].title}
                </h3>

                <div className="space-y-8">
                  {[
                    {
                      name: "featured" as const,
                      label: "Featured profile placement",
                    },
                    {
                      name: "storage" as const,
                      label: "Higher storage limits",
                    },
                    {
                      name: "contestEntries" as const,
                      label: "Contest entries",
                    },
                  ].map((item, index) => (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={`premiumFeatures.${item.name}`}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                            <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                              {index + 9}
                            </span>
                            Would you pay for {item.label}? (1-5 scale)
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-1">
                              <div className="text-sm text-gray-700 font-medium">
                                Scale: {field.value ?? 3}
                              </div>
                              <Slider
                                value={[field.value ?? 3]}
                                onValueChange={(val) => field.onChange(val[0])}
                                min={1}
                                max={5}
                                step={1}
                                className="cursor-pointer"
                              />
                            </div>
                          </FormControl>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Definitely Not</span>
                            <span>Definitely Yes</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  {/* Commission Rate Dropdown */}
                  <FormField
                    control={form.control}
                    name="commissionAcceptance"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            13
                          </span>
                          Acceptable commission rate
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full py-5 px-4 text-base cursor-pointer rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors">
                              <SelectValue placeholder="Select a commission rate" />
                            </SelectTrigger>
                            <SelectContent className="mt-1 py-1 shadow-lg rounded-lg border border-gray-200 bg-white">
                              {[
                                { value: "10%", label: "10%" },
                                { value: "20%", label: "20%" },
                                { value: "30%", label: "30%" },
                                { value: "flat", label: "Only flat fee" },
                              ].map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className="py-3 px-4 cursor-pointer text-base hover:bg-blue-50 active:bg-blue-100 transition-colors"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
            )}

            {/* Section 5: Concerns & Suggestions */}
            {currentStep === 4 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {formSections[4].icon} {formSections[4].title}
                </h3>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="concerns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            14
                          </span>
                          Biggest worry about joining (select all)
                        </FormLabel>
                        <div className="space-y-1 mt-4">
                          {[
                            "Not enough users",
                            "High fees",
                            "Image theft",
                            "Other",
                          ].map((concern) => (
                            <FormItem
                              key={concern}
                              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(concern)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          concern,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (val) => val !== concern
                                          )
                                        );
                                  }}
                                  className="h-5 w-5 cursor-pointer border-2 border-gray-300 rounded-md data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                />
                              </FormControl>
                              <FormLabel
                                htmlFor={`concern-${concern}`}
                                className="text-base font-medium text-gray-800 cursor-pointer flex-1"
                              >
                                {concern}
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

            {/* Section 6: Additional Features */}
            {currentStep === 5 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {formSections[5].icon} {formSections[5].title}
                </h3>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="featureRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            15
                          </span>
                          What would make this platform indispensable? (select
                          all)
                        </FormLabel>

                        <div className="space-y-3 mt-4">
                          {[
                            "AI-powered tagging",
                            "Client booking system",
                            "Digital contracts",
                            "Portfolio website builder",
                            "RAW file storage",
                            "Peer review system",
                            "Equipment rental",
                          ].map((feature) => (
                            <FormItem
                              key={feature}
                              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(feature)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          feature,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (val) => val !== feature
                                          )
                                        );
                                  }}
                                  className="h-5 w-5 cursor-pointer border-2 border-gray-300 rounded-md data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                />
                              </FormControl>
                              <FormLabel
                                htmlFor={`feature-${feature}`}
                                className="text-base cursor-pointer"
                              >
                                {feature}
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

            {/* Section 7: Collaboration Preferences */}
            {currentStep === 6 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {formSections[6].icon} {formSections[6].title}
                </h3>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="collaborationPrefs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                          <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                            16
                          </span>
                          Would you be interested in: (select all)
                        </FormLabel>

                        <div className="space-y-3 mt-4">
                          {[
                            "Collaborative projects",
                            "Mentorship programs",
                            "Local meetups",
                            "None of these",
                          ].map((option) => (
                            <FormItem
                              key={option}
                              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          option,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (val) => val !== option
                                          )
                                        );
                                  }}
                                  className="h-5 w-5 cursor-pointer border-2 border-gray-300 rounded-md data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                />
                              </FormControl>
                              <FormLabel
                                htmlFor={`collab-${option}`}
                                className="text-base cursor-pointer"
                              >
                                {option}
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

            {/* Section 8: Additional Feature Opinions */}
            {currentStep === 7 && (
              <motion.div variants={item} className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {formSections[6].icon} {formSections[6].title}
                </h3>

                <div className="space-y-6">
                  <div className="space-y-4 pt-4">
                    {/* Desired Features Textarea */}
                    <FormField
                      control={form.control}
                      name="additionalFeatureOpinions.desiredFeatures"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-800">
                            <span className="flex items-center font-bold justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm">
                              17
                            </span>
                            Additional feature suggestions
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="E.g., AI photo editing tools, client management system..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Importance Radio Group */}
                    <FormField
                      control={form.control}
                      name="additionalFeatureOpinions.importance"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="block text-sm font-medium text-gray-700">
                            How important are these features to you?
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-2"
                            >
                              {["low", "medium", "high"].map((level) => (
                                <FormItem
                                  key={level}
                                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={level}
                                      id={`importance-${level}`}
                                      className="h-5 w-5 cursor-pointer border-2 border-gray-300 rounded-md data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                    />
                                  </FormControl>
                                  <FormLabel
                                    htmlFor={`importance-${level}`}
                                    className="text-sm capitalize cursor-pointer"
                                  >
                                    {level}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Willing to Pay Checkbox */}
                    <FormField
                      control={form.control}
                      name="additionalFeatureOpinions.willingToPay"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 pt-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-5 w-5 cursor-pointer border-2 border-gray-300 rounded-md data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor="willingToPay"
                            className="text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            Would you be willing to pay for these features?
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit button (only shown on last step) */}
            {currentStep === formSections.length - 1 && (
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
