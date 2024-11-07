import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAssistantModifications } from "@/hooks/useAssistantModifications";
import { AnimatePresence } from "framer-motion";
import { Check, Terminal } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import CustomColorRing from "./loaders/ColorRing";
import { useResumeState } from "./resumes/ResumeStateContext";
import { useApplicationForResume } from "@/hooks/useApplicationForResume";


const AutomatedResumeEditor = ({
}) => {
  const { resume, temporaryResume, setTemporaryResume, applyTemporaryResume } =
    useResumeState();
  const [automatedInput, setAutomatedInput] = useState("");
  const [includeJobDescription, setIncludeJobDescription] = useState(false);
  const { mutate: modifyResume, isPending: isModifying } =
    useAssistantModifications();
  const { data: application } = useApplicationForResume(resume?.id ?? "");
  const handleSaveChanges = useCallback(() => {
    applyTemporaryResume();
    toast({
      title: "Resume updated",
    });
  }, [applyTemporaryResume]);

  const handleUndoChanges = useCallback(() => {
    setTemporaryResume(null);
    setAutomatedInput("");
  }, [setTemporaryResume]);

  const handleAutomatedModification = useCallback(() => {
    if (!resume?.id || (automatedInput === "" && !includeJobDescription))
      return;

    modifyResume(
      {
        resumeId: resume.id,
        input: `user: ${automatedInput}`,
        includeJobDescription,
      },
      {
        onSuccess: (modifiedResume) => {
          setTemporaryResume(modifiedResume);
          setAutomatedInput("");
        },
      }
    );
  }, [
    resume,
    automatedInput,
    modifyResume,
    includeJobDescription,
    setTemporaryResume,
  ]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setAutomatedInput(e.target.value);
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
      <div className="space-y-4">
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
            {temporaryResume && (
              <>
                <Button onClick={handleSaveChanges} variant="default">
                  <Check className="mr-2 h-4 w-4" /> Save Changes
                </Button>
                <Button onClick={handleUndoChanges} variant="outline">
                  Undo Changes
                </Button>
              </>
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
    </div>
  );
};

export default AutomatedResumeEditor;
