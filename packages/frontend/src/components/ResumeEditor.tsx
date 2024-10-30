import React, { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResumeState } from "./resumes/ResumeStateContext";
import { TrashIcon } from "lucide-react";

const ResumeEditor: React.FC = () => {
  const {
    resume,
    updateResumeField,
    updateExperience,
    updateEducation,
    addExperience,
    addEducation,
    updateSkill,
    addSkill,
  } = useResumeState();

  const personalInfoFields = useMemo(
    () => [
      { label: "Full Name", field: "fullName" as const },
      { label: "Email", field: "email" as const },
      { label: "Phone Number", field: "phoneNumber" as const },
      { label: "Address", field: "address" as const },
      { label: "City", field: "city" as const },
      { label: "Country", field: "country" as const },
      { label: "Position Name", field: "positionName" as const },
    ],
    []
  );

  if (!resume) {
    return null;
  }

  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="personal-info">
        <AccordionTrigger>Personal Information</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-4">
            {personalInfoFields.map(({ label, field }) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {label}
                </label>
                <Input
                  value={resume.data[field] || ""}
                  onChange={(e) => updateResumeField(field, e.target.value)}
                />
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="experience">
        <AccordionTrigger>Experience</AccordionTrigger>
        <AccordionContent>
          {resume.data.experience?.map((exp, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <Input
                className="mb-2"
                placeholder="Position Title"
                value={exp.positionTitle || ""}
                onChange={(e) =>
                  updateExperience(index, "positionTitle", e.target.value)
                }
              />
              <Input
                className="mb-2"
                placeholder="Company"
                value={exp.company || ""}
                onChange={(e) =>
                  updateExperience(index, "company", e.target.value)
                }
              />
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input
                  placeholder="Start Date"
                  value={exp.startDate || ""}
                  onChange={(e) =>
                    updateExperience(index, "startDate", e.target.value)
                  }
                />
                <Input
                  placeholder="End Date"
                  value={exp.endDate || ""}
                  onChange={(e) =>
                    updateExperience(index, "endDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">
                  Contributions
                </label>
                {exp.contributions?.map((contribution, contribIndex) => (
                  <div key={contribIndex} className="flex gap-2">
                    <Input
                      value={contribution}
                      onChange={(e) => {
                        const newContributions = [...(exp.contributions || [])];
                        newContributions[contribIndex] = e.target.value;
                        updateExperience(
                          index,
                          "contributions",
                          newContributions
                        );
                      }}
                      placeholder={`Contribution ${contribIndex + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newContributions = [...(exp.contributions || [])];
                        newContributions.splice(contribIndex, 1);
                        updateExperience(
                          index,
                          "contributions",
                          newContributions
                        );
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newContributions = [...(exp.contributions || []), ""];
                    updateExperience(index, "contributions", newContributions);
                  }}
                >
                  Add Contribution
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={addExperience}>Add Experience</Button>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="education">
        <AccordionTrigger>Education</AccordionTrigger>
        <AccordionContent>
          {resume.data.education?.map((edu, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <Input
                className="mb-2"
                placeholder="University"
                value={edu.university || ""}
                onChange={(e) =>
                  updateEducation(index, "university", e.target.value)
                }
              />
              <Input
                className="mb-2"
                placeholder="Degree"
                value={edu.degree || ""}
                onChange={(e) =>
                  updateEducation(index, "degree", e.target.value)
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Start Date"
                  value={edu.startDate || ""}
                  onChange={(e) =>
                    updateEducation(index, "startDate", e.target.value)
                  }
                />
                <Input
                  placeholder="End Date"
                  value={edu.endDate || ""}
                  onChange={(e) =>
                    updateEducation(index, "endDate", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <Button onClick={addEducation}>Add Education</Button>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="skills">
        <AccordionTrigger>Skills</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {resume.data.skills?.map((skill, index) => (
              <div key={index} className="mb-2">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  placeholder="Skill"
                />
              </div>
            ))}
          </div>
          <Button onClick={addSkill}>Add Skill</Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ResumeEditor;
