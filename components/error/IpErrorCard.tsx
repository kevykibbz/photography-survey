import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IpErrorCardProps {
  ipError?: { message?: string };
  handleRetry: () => void;
  isIpLoading: boolean;
}

export const IpErrorCard = ({ ipError, handleRetry, isIpLoading }: IpErrorCardProps) => (
  <Card className="w-full max-w-3xl mx-auto border-2 border-red-500 shadow-lg bg-red-50">
    <CardHeader>
      <CardTitle className="text-2xl font-semibold text-red-600 flex items-center gap-2">
        <TriangleAlertIcon className="text-4xl text-red-600" />
        Something Went Wrong
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 p-6">
      <div className="text-lg text-red-700">
        <p>{ipError?.message || "An unknown error occurred. Please try again later."}</p>
        <p className="text-sm text-gray-600 mt-2">
          If you are using an ad blocker, please try disabling it temporarily, as it may block essential scripts needed to load the page properly.
        </p>
      </div>
      <div className="mt-4">
        <Button
          onClick={handleRetry}
          variant="destructive"
          className="w-full py-2 rounded-lg cursor-pointer"
          disabled={isIpLoading}
        >
          {isIpLoading ? "Retrying..." : "Retry"}
        </Button>
      </div>
    </CardContent>
  </Card>
);
