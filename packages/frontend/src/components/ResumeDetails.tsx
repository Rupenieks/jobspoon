import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useReadResumes } from "@/hooks/useReadResumes";
import { parseResumeDate } from "@/utils/dateUtils";
import { PDFViewer } from "@react-pdf/renderer";
import { TResume } from "@redundant/common/src";
import { ChevronLeft } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomColorRing from "./loaders/ColorRing";
import ResumePDFRenderer from "./resumes/ResumePDFRenderer";

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

  const [isPDFLoading, setIsPDFLoading] = useState(true);

  const handlePDFRenderSuccess = useCallback(() => {
    console.log("Success");
    setIsPDFLoading(false);
  }, []);

  // Debounce the editedResume to reduce the number of re-renders
  const debouncedResume = useDebouncedValue(editedResume, 1000);

  useEffect(() => {
    console.log("Debounced resume changed", debouncedResume);
  }, [debouncedResume]);

  // Reset loading state when resume changes
  useEffect(() => {
    setIsPDFLoading(true);
  }, [editedResume]);

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

  const handleAddExperience = useCallback(() => {
    setEditedResume((prev) => {
      if (!prev) return null;
      const newExperience = [
        ...(prev.experience || []),
        {
          positionTitle: "",
          company: "",
          startDate: "",
          endDate: "",
          contributions: [],
        },
      ];
      return { ...prev, experience: newExperience };
    });
  }, []);

  const handleAddEducation = useCallback(() => {
    setEditedResume((prev) => {
      if (!prev) return null;
      const newEducation = [
        ...(prev.education || []),
        { university: "", degree: "", startDate: "", endDate: "" },
      ];
      return { ...prev, education: newEducation };
    });
  }, []);

  const handleAddSkill = useCallback(() => {
    setEditedResume((prev) => {
      if (!prev) return null;
      const newSkills = [...(prev.skills || []), ""];
      return { ...prev, skills: newSkills };
    });
  }, []);

  const handleSaveChanges = useCallback(() => {
    // Implement the logic to save the changes to the backend
    console.log("Saving changes:", editedResume);
  }, [editedResume]);

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

      <div className="flex gap-6">
        <div className="w-1/2 space-y-8">
          <h1 className="text-2xl font-bold">{editedResume.positionName}</h1>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={editedResume.fullName || ""}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
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
            </div>
          </div>

          {/* Position Name */}
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

          {/* Experience Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Experience</h2>
            {editedResume.experience?.map((exp, index) => (
              <div key={index} className="space-y-2 border p-4 rounded">
                <div className="grid grid-cols-2 gap-4">
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
            ))}
            <Button onClick={() => handleAddExperience()}>
              Add Experience
            </Button>
          </div>

          {/* Education Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Education</h2>
            {editedResume.education?.map((edu, index) => (
              <div key={index} className="space-y-2 border p-4 rounded">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="University"
                    value={edu.university || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "university", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Degree"
                    value={edu.degree || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                  />
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
            ))}
            <Button onClick={() => handleAddEducation()}>Add Education</Button>
          </div>

          {/* Skills Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {editedResume.skills?.map((skill, index) => (
                <Input
                  key={index}
                  className="w-auto"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                />
              ))}
              <Button onClick={() => handleAddSkill()}>Add Skill</Button>
            </div>
          </div>

          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>

        <div className="w-1/2">
          <div className="border p-4 h-[297mm] relative">
            <div
              className={`absolute inset-0 z-10 transition-opacity duration-300 ${
                isPDFLoading ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="w-full h-full flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm">
                <CustomColorRing
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              </div>
            </div>
            <PDFViewer showToolbar={false} width="100%" height="100%">
              <ResumePDFRenderer
                resume={debouncedResume as TResume}
                onRenderSuccess={handlePDFRenderSuccess}
              />
            </PDFViewer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetails;
