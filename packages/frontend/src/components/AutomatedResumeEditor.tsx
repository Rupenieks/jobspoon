import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAssistantModifications } from "@/hooks/useAssistantModifications";
import { TApplication, TResume } from "@redundant/common/src";
import { AnimatePresence } from "framer-motion";
import { Check, Terminal } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import CustomColorRing from "./loaders/ColorRing";
import ResumePDFPreviewLoadingWrapper from "./resumes/ResumePDFPreviewLoadingWrapper";
import { useResumeState } from "./resumes/ResumeStateContext";

interface AutomatedResumeEditorProps {
  application?: TApplication;
}

const AutomatedResumeEditor: React.FC<AutomatedResumeEditorProps> = ({
  application,
}) => {
  const { resume, updateEntireResume } = useResumeState();
  const [automatedInput, setAutomatedInput] = useState("");
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [modifiedResumeData, setModifiedResumeData] = useState<TResume | null>(
    resume
  );
  const [includeJobDescription, setIncludeJobDescription] = useState(false);
  const { mutate: modifyResume, isPending: isModifying } =
    useAssistantModifications();

  const handleSaveChanges = useCallback(() => {
    if (modifiedResumeData) {
      updateEntireResume(modifiedResumeData);
      setShowSaveButton(false);
      toast({
        title: "Resume updated",
      });
    }
  }, [modifiedResumeData, updateEntireResume]);

  const handleAutomatedModification = useCallback(() => {
    if (!resume?.id || (automatedInput === "" && !includeJobDescription))
      return;

    modifyResume(
      {
        resumeId: resume.id,
        input: `user: ${automatedInput}${
          includeJobDescription && application?.match
            ? `\n\nCompany: ${application.match.companyName}
               \nPosition: ${application.match.positionTitle}
               \nSeniority: ${application.match.seniority}
               \nDescription: ${application.match.description}
               \nDetailed Description: ${application.match.longDescription}`
            : ""
        }`,
      },
      {
        onSuccess: (modifiedResume) => {
          setModifiedResumeData(modifiedResume);
          setShowSaveButton(true);
          setAutomatedInput("");
        },
      }
    );
  }, [resume, automatedInput, modifyResume, includeJobDescription]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setAutomatedInput(e.target.value);
      setShowSaveButton(false);
    },
    []
  );

  const colorRingColors = useMemo(
    () => ["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"],
    []
  );

  const handleIncludeJobDescription = useCallback(() => {
    toast({
      title: `${
        includeJobDescription ? "Excluding" : "Including"
      } job description`,
      description: includeJobDescription
        ? "Our assistant will no longer use the job description to modify the resume."
        : "Our assistant will use the job description to modify the resume.",
    });
    setIncludeJobDescription(!includeJobDescription);
  }, [includeJobDescription]);

  return (
    <div className="flex gap-6">
      <div className="w-1/2 space-y-4">
        <Textarea
          placeholder="Write what you want to change about the resume or paste in a job description"
          value={automatedInput}
          onChange={handleInputChange}
          className="h-48 mb-4"
        />
        {includeJobDescription && (
          <Alert className="bg-blue-900/10">
            <Terminal className="h-4 w-4 " />
            <AlertTitle className="">Job description added!</AlertTitle>
            <AlertDescription>
              Our assistant will modify the resume based on the job description.
            </AlertDescription>
          </Alert>
        )}
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Ask anything</AlertTitle>
          <AlertDescription>
            Our assistant will modify the resume based on your input. Feel free
            to paste in a job description!
          </AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button
            onClick={handleAutomatedModification}
            disabled={
              isModifying || (automatedInput === "" && !includeJobDescription)
            }
          >
            {isModifying ? (
              <CustomColorRing
                colors={
                  colorRingColors as [string, string, string, string, string]
                }
              />
            ) : (
              "Modify Resume"
            )}
          </Button>
          <AnimatePresence>
            {showSaveButton && (
              <Button onClick={handleSaveChanges}>
                <Check className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            )}
          </AnimatePresence>
          {application && (
            <Button onClick={handleIncludeJobDescription}>
              {includeJobDescription
                ? "Exclude job description"
                : "Include job description"}
            </Button>
          )}
        </div>
      </div>
      <div className="w-1/2">
        <ResumePDFPreviewLoadingWrapper />
      </div>
    </div>
  );
};

export default AutomatedResumeEditor;
