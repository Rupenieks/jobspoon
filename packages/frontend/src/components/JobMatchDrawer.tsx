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
import { Building2, MapPin, Calendar, Briefcase, ExternalLink } from "lucide-react";
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

  const truncateDescription = (text: string) => {
    if (text?.length <= 300) return text;
    return isDescriptionExpanded ? text : `${text.slice(0, 300)}...`;
  };

  if (!matchId) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <div className="w-full">
          <DrawerHeader className="px-6">
            {isPending ? (
              <>
                <Skeleton className="h-8 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </>
            ) : (
              <>
                <DrawerTitle className="text-2xl font-bold flex items-center justify-between">
                  <span>{match?.positionTitle}</span>
                  {match?.salary && (
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                      {match.salary}
                    </Badge>
                  )}
                </DrawerTitle>
                <DrawerDescription className="flex items-center gap-2 mt-2">
                  <Building2 className="h-4 w-4" />
                  {match?.companyName}
                </DrawerDescription>
              </>
            )}
          </DrawerHeader>

          {isPending ? (
            <div className="p-6">
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="px-6 overflow-y-auto flex flex-col space-y-6">
              {/* Job Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>
                    {match?.city}, {match?.country}
                    {match?.remote && " • Remote"}
                    {match?.hybrid && " • Hybrid"}
                  </span>
                </div>
                {match?.datePosted && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>
                      Posted {formatDistanceToNow(new Date(match.datePosted), { addSuffix: true })}
                    </span>
                  </div>
                )}
                {match?.seniority && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    <span>{match.seniority}</span>
                  </div>
                )}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Description */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-muted-foreground whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                        {match?.description && truncateDescription(match.description)}
                        {match?.description && match.description.length > 300 && (
                          <Button
                            variant="link"
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="ml-2"
                          >
                            {isDescriptionExpanded ? "Show less" : "Show more"}
                          </Button>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Company Info */}
                <div className="space-y-6">
                  {match?.company && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">About {match.companyName}</h3>
                      <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                        {match.company.employeeCount && (
                          <div>
                            <span className="text-sm text-muted-foreground block mb-1">Employees</span>
                            <p className="font-medium">{match.company.employeeCount.toLocaleString()}</p>
                          </div>
                        )}
                        {match.company.industry && (
                          <div>
                            <span className="text-sm text-muted-foreground block mb-1">Industry</span>
                            <p className="font-medium">{match.company.industry}</p>
                          </div>
                        )}
                        {match.company.technologies && match.company.technologies.length > 0 && (
                          <div>
                            <span className="text-sm text-muted-foreground block mb-2">Technologies</span>
                            <div className="flex flex-wrap gap-2">
                              {match.company.technologies.map((tech) => (
                                <Badge key={tech} variant="secondary">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DrawerFooter className="px-6 mt-6">
            <div className="flex gap-4">
              {match?.applyUrl && (
                <Button className="flex-1" onClick={() => window.open(match?.applyUrl ?? '', "_blank")}>
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