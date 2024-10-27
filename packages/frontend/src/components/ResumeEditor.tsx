import React, { useCallback, useMemo } from "react";
import { TResume } from "@redundant/common/src";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { parseResumeDate } from "@/utils/dateUtils";

interface ResumeEditorProps {
  resume: TResume;
  onUpdate: (updatedResume: TResume) => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ resume, onUpdate }) => {
  const handleInputChange = useCallback(
    (field: keyof TResume, value: any) => {
      onUpdate({ ...resume, [field]: value });
    },
    [resume, onUpdate]
  );

  const handleExperienceChange = useCallback(
    (index: number, field: keyof TResume["experience"][0], value: any) => {
      const newExperience = [...(resume.experience || [])];
      newExperience[index] = { ...newExperience[index], [field]: value };
      onUpdate({ ...resume, experience: newExperience });
    },
    [resume, onUpdate]
  );

  const handleEducationChange = useCallback(
    (index: number, field: keyof TResume["education"][0], value: any) => {
      const newEducation = [...(resume.education || [])];
      newEducation[index] = { ...newEducation[index], [field]: value };
      onUpdate({ ...resume, education: newEducation });
    },
    [resume, onUpdate]
  );

  const handleAddExperience = useCallback(() => {
    const newExperience = [
      ...(resume.experience || []),
      {
        positionTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        contributions: [],
      },
    ];
    onUpdate({ ...resume, experience: newExperience });
  }, [resume, onUpdate]);

  const handleAddEducation = useCallback(() => {
    const newEducation = [
      ...(resume.education || []),
      { university: "", degree: "", startDate: "", endDate: "" },
    ];
    onUpdate({ ...resume, education: newEducation });
  }, [resume, onUpdate]);

  const handleSkillChange = useCallback(
    (index: number, value: string) => {
      const newSkills = [...(resume.skills || [])];
      newSkills[index] = value;
      onUpdate({ ...resume, skills: newSkills });
    },
    [resume, onUpdate]
  );

  const handleAddSkill = useCallback(() => {
    const newSkills = [...(resume.skills || []), ""];
    onUpdate({ ...resume, skills: newSkills });
  }, [resume, onUpdate]);

  const personalInfoFields = useMemo(
    () => [
      { label: "Full Name", field: "fullName" },
      { label: "Email", field: "email" },
      { label: "Phone Number", field: "phoneNumber" },
      { label: "Address", field: "address" },
      { label: "City", field: "city" },
      { label: "Country", field: "country" },
      { label: "Position Name", field: "positionName" },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {personalInfoFields.map(({ label, field }) => (
          <div key={field}>
            <Label htmlFor={field}>{label}</Label>
            <Input
              id={field}
              value={resume[field as keyof TResume] || ""}
              onChange={(e) =>
                handleInputChange(field as keyof TResume, e.target.value)
              }
            />
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Experience</h2>
        {resume.experience?.map((exp, index) => (
          <div key={index} className="space-y-2 border p-4 rounded mb-4">
            <Input
              placeholder="Position Title"
              value={exp.positionTitle || ""}
              onChange={(e) =>
                handleExperienceChange(index, "positionTitle", e.target.value)
              }
            />
            <Input
              placeholder="Company"
              value={exp.company || ""}
              onChange={(e) =>
                handleExperienceChange(index, "company", e.target.value)
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <DatePicker
                placeholder="Start Date"
                value={
                  exp.startDate ? parseResumeDate(exp.startDate) : undefined
                }
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
                value={exp.endDate ? parseResumeDate(exp.endDate) : undefined}
                onChange={(date) =>
                  handleExperienceChange(index, "endDate", date?.toISOString())
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
        <Button onClick={handleAddExperience}>Add Experience</Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Education</h2>
        {resume.education?.map((edu, index) => (
          <div key={index} className="space-y-2 border p-4 rounded mb-4">
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
            <div className="grid grid-cols-2 gap-4">
              <DatePicker
                placeholder="Start Date"
                value={
                  edu.startDate ? parseResumeDate(edu.startDate) : undefined
                }
                onChange={(date) =>
                  handleEducationChange(index, "startDate", date?.toISOString())
                }
              />
              <DatePicker
                placeholder="End Date"
                value={edu.endDate ? parseResumeDate(edu.endDate) : undefined}
                onChange={(date) =>
                  handleEducationChange(index, "endDate", date?.toISOString())
                }
              />
            </div>
          </div>
        ))}
        <Button onClick={handleAddEducation}>Add Education</Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {resume.skills?.map((skill, index) => (
            <Input
              key={index}
              className="w-auto"
              value={skill}
              onChange={(e) => handleSkillChange(index, e.target.value)}
            />
          ))}
          <Button onClick={handleAddSkill}>Add Skill</Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
