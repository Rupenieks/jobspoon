import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const ResumeEditorSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-6 w-2/3" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <Skeleton className="h-10 w-1/4" />
  </div>
);

const ResumePDFSkeleton: React.FC = () => (
  <div className="w-full h-[600px] bg-gray-100 rounded-md flex items-center justify-center">
    <Skeleton className="h-5/6 w-5/6" />
  </div>
);

export const ResumeSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-40" /> {/* Back button */}
    <Skeleton className="h-8 w-1/2" /> {/* Title */}
    <div className="flex gap-6">
      <div className="w-1/2 space-y-8">
        <ResumeEditorSkeleton />
      </div>
      <Separator orientation="vertical" className="h-auto" />
      <div className="w-1/2">
        <ResumePDFSkeleton />
      </div>
    </div>
  </div>
);
