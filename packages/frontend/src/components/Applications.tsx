import React from "react";
import { useReadApplications } from "@/hooks/useReadApplications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Applications: React.FC = () => {
  const { data: applications, isLoading } = useReadApplications();
  const navigate = useNavigate();

  const TableContent = () => (
    <Table className="border rounded-lg">
      <TableHeader className="bg-gray-50">
        <TableRow className="hover:bg-muted">
          <TableHead className="font-semibold">Company</TableHead>
          <TableHead className="font-semibold">Position</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
          <TableHead className="font-semibold">Resume</TableHead>
          <TableHead className="font-semibold">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          [...Array(4)].map((_, index) => (
            <TableRow key={index} className="border-b">
              <TableCell><Skeleton className="h-4 w-[140px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
              <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            </TableRow>
          ))
        ) : (
          applications?.map((application) => (
            <TableRow 
              key={application.id}
              className="cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
              onClick={() => navigate(`/applications/${application.id}`)}
            >
              <TableCell className="font-medium">
                {application.match.companyName}
              </TableCell>
              <TableCell>{application.match.positionTitle}</TableCell>
              <TableCell>
                <Badge variant="secondary">Started</Badge>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/resumes/${application.resumeId}`);
                        }}
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4" />
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Go to resume
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(application.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Applications</h1>
      <div className="border rounded-lg">
        <TableContent />
      </div>
    </div>
  );
};

export default Applications;
