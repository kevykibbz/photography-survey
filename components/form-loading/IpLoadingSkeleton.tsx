import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export const IpLoadingSkeleton = () => (
  <Card className="border-0 shadow-lg w-full max-w-3xl mx-auto">
    <CardHeader>
      <CardTitle className="text-2xl flex items-center gap-2">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-8 w-48" />
      </CardTitle>
    </CardHeader>

    <CardContent>
      <motion.form className="space-y-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>

        <div className="space-y-6">
          {/* Specialty Field */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-base font-medium text-gray-800">
              <Skeleton className="h-8 w-8 rounded-full bg-blue-100" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Years of Experience Field */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-lg font-medium text-gray-800">
              <Skeleton className="h-8 w-8 rounded-full bg-blue-100" />
              <Skeleton className="h-6 w-64" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </motion.form>
    </CardContent>
  </Card>
);
