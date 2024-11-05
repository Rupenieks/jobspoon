import React, { useMemo, useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResumeState } from "./resumes/ResumeStateContext";
import {
  TrashIcon,
  GripVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { TResumeConfig } from "@redundant/common/src";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUpdateResumeImages } from "@/hooks/useUpdateResumeImages";
import {
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';

// Sortable Experience Item Component
const SortableExperienceItem = ({ experience, index, updateExperience }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: index.toString(),
  });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 50 : 0,
      opacity: isDragging ? 0.8 : 1,
      position: "relative",
      backgroundColor: isDragging ? "white" : undefined,
      boxShadow: isDragging ? "rgba(0, 0, 0, 0.1) 0px 10px 50px" : undefined,
    }),
    [transform, transition, isDragging]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-6 p-4 border rounded-lg transition-colors ${
        isDragging
          ? "border-primary/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-background border-border hover:border-primary/50"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab hover:bg-gray-100 p-1 rounded"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
        <Input
          placeholder="Position Title"
          value={experience.positionTitle || ""}
          onChange={(e) =>
            updateExperience(index, "positionTitle", e.target.value)
          }
        />
      </div>
      <Input
        className="mb-2"
        placeholder="Company"
        value={experience.company || ""}
        onChange={(e) => updateExperience(index, "company", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Input
          placeholder="Start Date"
          value={experience.startDate || ""}
          onChange={(e) => updateExperience(index, "startDate", e.target.value)}
        />
        <Input
          placeholder="End Date"
          value={experience.endDate || ""}
          onChange={(e) => updateExperience(index, "endDate", e.target.value)}
        />
      </div>
      {experience.contributions?.map((contribution, contIndex) => (
        <div key={contIndex} className="flex gap-2 mb-2">
          <Input
            value={contribution}
            onChange={(e) =>
              updateExperience(index, "contributions", [
                ...(experience.contributions?.slice(0, contIndex) || []),
                e.target.value,
                ...(experience.contributions?.slice(contIndex + 1) || []),
              ])
            }
            placeholder="Contribution"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              updateExperience(index, "contributions", [
                ...(experience.contributions?.slice(0, contIndex) || []),
                ...(experience.contributions?.slice(contIndex + 1) || []),
              ])
            }
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          updateExperience(index, "contributions", [
            ...(experience.contributions || []),
            "",
          ])
        }
      >
        Add Contribution
      </Button>
    </div>
  );
};

// Sortable Education Item Component
const SortableEducationItem = ({ education, index, updateEducation }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: index.toString(),
  });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 50 : 0,
      opacity: isDragging ? 0.8 : 1,
      position: "relative",
      backgroundColor: isDragging ? "white" : undefined,
      boxShadow: isDragging ? "rgba(0, 0, 0, 0.1) 0px 10px 50px" : undefined,
    }),
    [transform, transition, isDragging]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-6 p-4 border rounded-lg transition-colors ${
        isDragging
          ? "border-primary/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-background border-border hover:border-primary/50"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab hover:bg-gray-100 p-1 rounded"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
        <Input
          placeholder="University"
          value={education.university || ""}
          onChange={(e) => updateEducation(index, "university", e.target.value)}
        />
      </div>
      <Input
        className="mb-2"
        placeholder="Degree"
        value={education.degree || ""}
        onChange={(e) => updateEducation(index, "degree", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Start Date"
          value={education.startDate || ""}
          onChange={(e) => updateEducation(index, "startDate", e.target.value)}
        />
        <Input
          placeholder="End Date"
          value={education.endDate || ""}
          onChange={(e) => updateEducation(index, "endDate", e.target.value)}
        />
      </div>
    </div>
  );
};

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

  const { mutate: updateResumeImages } = useUpdateResumeImages();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleExperienceDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id as string, 10);
      const newIndex = parseInt(over.id as string, 10);
      const newExperience = arrayMove(
        resume?.data.experience || [],
        oldIndex,
        newIndex
      );
      updateResumeField("experience", newExperience);
    }
  };

  const handleEducationDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id as string, 10);
      const newIndex = parseInt(over.id as string, 10);
      const newEducation = arrayMove(
        resume?.data.education || [],
        oldIndex,
        newIndex
      );
      updateResumeField("education", newEducation);
    }
  };

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

  const availableFonts = useMemo(
    () => ["Roboto", "Open Sans", "Lato", "Montserrat", "Source Sans Pro"],
    []
  );

  const updateConfig = useCallback(
    (key: keyof TResumeConfig, value: any) => {
      if (!resume) return;
      updateResumeField("config", {
        ...resume?.data.config,
        [key]: value,
      });
    },
    [resume?.data.config, updateResumeField]
  );

  const handleProfileImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && resume) {
        updateResumeImages({
          id: resume?.id,
          profileImage: file,
        });
      }
    },
    []
  );

  const updatePersonalInfo = useCallback(
    (field: string, value: string) => {
      if (!resume) return;
      updateResumeField("personalInfo", {
        ...resume.data.personalInfo,
        [field]: value,
      });
    },
    [resume?.data.personalInfo, updateResumeField]
  );

  const updatePages = useCallback(
    (newPageCount: number) => {
      if (!resume) return;
      
      const currentPages = resume.data.pages.length;
      
      if (newPageCount > currentPages) {
        // Add new empty pages
        const newPages = Array.from({ length: newPageCount - currentPages }).map(
          () => ({
            sections: [], // Empty sections array for new pages
          })
        );
        updateResumeField("pages", [...resume.data.pages, ...newPages]);
      } else if (newPageCount < currentPages) {
        // Remove pages from the end
        updateResumeField("pages", resume.data.pages.slice(0, newPageCount));
      }
    },
    [resume?.data.pages, updateResumeField]
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
                  value={resume.data.personalInfo[field] || ""}
                  onChange={(e) => updatePersonalInfo(field, e.target.value)}
                />
              </div>
            ))}
            <div>
              <label>Profile Image</label>
              <Input type="file" onChange={handleProfileImageUpload} />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="experience">
        <AccordionTrigger>Experience</AccordionTrigger>
        <AccordionContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleExperienceDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={resume.data.experience?.map((_, i) => i.toString()) || []}
              strategy={verticalListSortingStrategy}
            >
              {resume.data.experience?.map((exp, index) => (
                <SortableExperienceItem
                  key={index}
                  experience={exp}
                  index={index}
                  updateExperience={updateExperience}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button onClick={addExperience}>Add Experience</Button>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="education">
        <AccordionTrigger>Education</AccordionTrigger>
        <AccordionContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleEducationDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={resume.data.education?.map((_, i) => i.toString()) || []}
              strategy={verticalListSortingStrategy}
            >
              {resume.data.education?.map((edu, index) => (
                <SortableEducationItem
                  key={index}
                  education={edu}
                  index={index}
                  updateEducation={updateEducation}
                />
              ))}
            </SortableContext>
          </DndContext>
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

      <AccordionItem value="appearance">
        <AccordionTrigger>Appearance Settings</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Primary Color
              </label>
              <Input
                type="color"
                value={resume.data.config.primaryColor}
                onChange={(e) => updateConfig("primaryColor", e.target.value)}
                className="h-10 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Font Size (px)
              </label>
              <div className="flex gap-2">
                <Slider
                  value={[resume.data.config.fontSize]}
                  onValueChange={([value]) => updateConfig("fontSize", value)}
                  min={12}
                  max={24}
                  step={1}
                  className="flex-grow"
                />
                <Input
                  type="number"
                  value={resume.data.config.fontSize}
                  onChange={(e) =>
                    updateConfig("fontSize", Number(e.target.value))
                  }
                  className="w-20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Left Margin (mm)
              </label>
              <div className="flex gap-2">
                <Slider
                  value={[resume.data.config.margin]}
                  onValueChange={([value]) => updateConfig("margin", value)}
                  min={10}
                  max={50}
                  step={0.1}
                  className="flex-grow"
                />
                <Input
                  type="number"
                  value={resume.data.config.margin}
                  onChange={(e) =>
                    updateConfig("margin", Number(e.target.value))
                  }
                  className="w-20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Font Family
              </label>
              <Select
                value={resume.data.config.font}
                onValueChange={(value) => updateConfig("font", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Number of Pages
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updatePages(Math.max(1, resume.data.pages.length - 1))}
                  disabled={resume.data.pages.length <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={resume.data.pages.length}
                  onChange={(e) => {
                    const value = Math.max(1, Number(e.target.value));
                    updatePages(value);
                  }}
                  className="w-20 text-center"
                  min={1}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updatePages(resume.data.pages.length + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ResumeEditor;
