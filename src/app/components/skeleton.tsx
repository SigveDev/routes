import React from "react";
import { cn } from "@/functions/cn";

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-300 dark:bg-gray-700 w-full h-full",
        className
      )}
    ></div>
  );
};

export default Skeleton;
