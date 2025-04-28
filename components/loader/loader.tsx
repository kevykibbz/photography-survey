import { Camera } from "lucide-react";
import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      <Camera
        className="w-48 h-48 text-blue-500 opacity-20 rotate-12"
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -30%) rotate(10deg)",
        }}
      />
    </div>
  );
}
