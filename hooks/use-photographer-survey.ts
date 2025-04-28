import { PhotographerFormData } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const usePhotographerSurvey = () => {
  return useMutation({
    mutationFn: async (data: PhotographerFormData) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);
      try {
        const response = await fetch("/api/survey/photographer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw errorData;
        }

        return await response.json();
      } finally {
        clearTimeout(timeoutId);
      }
    },
    onSuccess: () => {
      toast.success("Survey submitted successfully!");
    },
    onError: (error: any) => {
      if (error?.errors) {
        error.errors.forEach((err: { path: string; message: string }) => {
          toast.error(`${err.path}: ${err.message}`);
        });
      } else {
        toast.error(
          error.message || "Failed to submit survey. Please try again."
        );
      }
    },
  });
};
