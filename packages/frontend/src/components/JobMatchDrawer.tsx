import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useGetMatch } from "@/hooks/useGetMatch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Building2, MapPin, Calendar, Briefcase, ExternalLink, Users2, Building } from "lucide-react";
import { Separator } from "./ui/separator";

interface JobMatchDrawerProps {
  matchId: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const JobMatchDrawer: React.FC<JobMatchDrawerProps> = ({
  matchId,
  isOpen,
  onClose,
}) => {
  const { match, isPending } = useGetMatch(matchId);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);



  if (!matchId) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent >
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-2 h-full">
              {/* Left Column */}
              <div className="p-6 flex flex-col h-full">
                {isPending ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ) : (
                  <>
                    {/* Header Information */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold">{match?.positionTitle}</h2>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{match?.companyName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {match?.city}, {match?.country}
                            {match?.remote && " • Remote"}
                            {match?.hybrid && " • Hybrid"}
                          </span>
                        </div>
                        {match?.datePosted && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Posted {formatDistanceToNow(new Date(match.datePosted), { addSuffix: true })}
                            </span>
                          </div>
                        )}
                        {match?.salary && (
                          <Badge variant="secondary" className="w-fit">
                            {match.salary}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Description */}
                    <div className="flex-1 overflow-hidden h-48 max-h-48">
                      <h3 className="font-semibold mb-2">Description</h3>
                      <div className="border rounded-lg p-4 h-[calc(100%-2rem)] overflow-y-auto">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {match?.description}
            
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right Column */}
              <div className="p-6 border-l h-full overflow-y-auto">
                {isPending ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  match?.company && (
                    <div className="space-y-6">
                      <h3 className="font-semibold">Company Details</h3>
                      
                      <div className="space-y-4">
                        {match.company.employeeCount && (
                          <div className="flex items-center gap-2">
                            <Users2 className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Employees</span>
                              <span className="font-medium">{match.company.employeeCount.toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                        
                        {match.company.industry && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Industry</span>
                              <span className="font-medium">{match.company.industry}</span>
                            </div>
                          </div>
                        )}

                        {match.company.technologies && match.company.technologies.length > 0 && (
                          <div>
                            <span className="text-sm text-muted-foreground block mb-2">Technologies</span>
                            <div className="max-h-32 overflow-y-auto border rounded-lg p-2">
                              <div className="flex flex-wrap gap-2">
                                {match.company.technologies.map((tech) => (
                                  <Badge key={tech} variant="secondary">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <DrawerFooter className="px-6 border-t">
            <div className="flex gap-4">
              {match?.applyUrl && (
                <Button className="flex-1" onClick={() => window.open(match.applyUrl ?? '', "_blank")}>
                  Apply Directly <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default JobMatchDrawer; 