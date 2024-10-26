import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useReadResumes } from "@/hooks/useReadResumes";
import { parseResumeDate } from "@/utils/dateUtils";
import { TResume } from "@redundant/common/src";
import { ChevronLeft } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const ResumeDetails: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { data: resumes } = useReadResumes();
  const navigate = useNavigate();

  const initialResume = useMemo(() => {
    return resumes?.find((r) => r.id === resumeId) || null;
  }, [resumes, resumeId]);

  const [editedResume, setEditedResume] = useState<TResume | null>(
    initialResume
  );

  const handleInputChange = useCallback((field: keyof TResume, value: any) => {
    setEditedResume((prev) => (prev ? { ...prev, [field]: value } : null));
  }, []);

  const handleExperienceChange = useCallback(
    (index: number, field: keyof TResume["experience"][0], value: any) => {
      setEditedResume((prev) => {
        if (!prev) return null;
        const newExperience = [...(prev.experience || [])];
        newExperience[index] = { ...newExperience[index], [field]: value };
        return { ...prev, experience: newExperience };
      });
    },
    []
  );

  const handleEducationChange = useCallback(
    (index: number, field: keyof TResume["education"][0], value: any) => {
      setEditedResume((prev) => {
        if (!prev) return null;
        const newEducation = [...(prev.education || [])];
        newEducation[index] = { ...newEducation[index], [field]: value };
        return { ...prev, education: newEducation };
      });
    },
    []
  );

  const handleSkillChange = useCallback((index: number, value: string) => {
    setEditedResume((prev) => {
      if (!prev) return null;
      const newSkills = [...(prev.skills || [])];
      newSkills[index] = value;
      return { ...prev, skills: newSkills };
    });
  }, []);

  if (!editedResume) {
    return <div>Resume not found</div>;
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/resumes")}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Resumes
      </Button>

      <Breadcrumb>
        <BreadcrumbItem>
          <Link
            to="/resumes"
            className="text-muted-foreground hover:text-foreground"
          >
            Resumes
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>{editedResume.positionName}</BreadcrumbItem>
      </Breadcrumb>

      <div className="flex gap-6">
        <div className="w-1/2 space-y-6">
          <h1 className="text-2xl font-bold">{editedResume.positionName}</h1>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={editedResume.fullName || ""}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={editedResume.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={editedResume.phoneNumber || ""}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editedResume.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={editedResume.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={editedResume.country || ""}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="positionName">Position Name</Label>
              <Input
                id="positionName"
                value={editedResume.positionName || ""}
                onChange={(e) =>
                  handleInputChange("positionName", e.target.value)
                }
              />
            </div>

            <div>
              <Label className="text-lg font-semibold">Experience</Label>
              {editedResume.experience?.map((exp, index) => (
                <div key={index} className="my-4">
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <Input
                      placeholder="Position Title"
                      value={exp.positionTitle || ""}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "positionTitle",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      placeholder="Company"
                      value={exp.company || ""}
                      onChange={(e) =>
                        handleExperienceChange(index, "company", e.target.value)
                      }
                    />
                    <div className="flex gap-2">
                      <DatePicker
                        placeholder="Start Date"
                        value={parseResumeDate(exp.startDate)}
                        onChange={(date) =>
                          handleExperienceChange(
                            index,
                            "startDate",
                            date?.toISOString()
                          )
                        }
                      />
                      <DatePicker
                        placeholder="End Date"
                        value={parseResumeDate(exp.endDate)}
                        onChange={(date) =>
                          handleExperienceChange(
                            index,
                            "endDate",
                            date?.toISOString()
                          )
                        }
                      />
                    </div>
                    <Textarea
                      placeholder="Contributions (one per line)"
                      value={exp.contributions?.join("\n") || ""}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "contributions",
                          e.target.value.split("\n")
                        )
                      }
                    />
                  </div>
                  {index === editedResume.experience.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>

            <div>
              <Label className="text-lg font-semibold">Education</Label>
              {editedResume.education?.map((edu, index) => (
                <div key={index} className="my-4">
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <Input
                      placeholder="University"
                      value={edu.university || ""}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "university",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      placeholder="Degree"
                      value={edu.degree || ""}
                      onChange={(e) =>
                        handleEducationChange(index, "degree", e.target.value)
                      }
                    />
                    <div className="flex gap-2">
                      <DatePicker
                        placeholder="Start Date"
                        value={parseResumeDate(edu.startDate)}
                        onChange={(date) =>
                          handleEducationChange(
                            index,
                            "startDate",
                            date?.toISOString()
                          )
                        }
                      />
                      <DatePicker
                        placeholder="End Date"
                        value={parseResumeDate(edu.endDate)}
                        onChange={(date) =>
                          handleEducationChange(
                            index,
                            "endDate",
                            date?.toISOString()
                          )
                        }
                      />
                    </div>
                  </div>
                  {index === editedResume.education.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>

            <div>
              <Label>Skills</Label>
              {editedResume.skills?.map((skill, index) => (
                <Input
                  key={index}
                  className="mb-2"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                />
              ))}
            </div>

            <Button>Save Changes</Button>
          </div>
        </div>

        <div className="w-1/2 border p-4">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <p>Preview content will be added here later.</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetails;
