import React, { useState, useCallback, useMemo, useEffect } from "react";
import { TResume } from "@redundant/common/src";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal, Check } from "lucide-react";
import CustomColorRing from "./loaders/ColorRing";
import ResumePDFPreviewLoadingWrapper from "./resumes/ResumePDFPreviewLoadingWrapper";
import { useAssistantModifications } from "@/hooks/useAssistantModifications";
import { useUpdateResume } from "@/hooks/useUpdateResume";
import { AnimatePresence, motion } from "framer-motion";

interface AutomatedResumeEditorProps {
  resume: TResume;
  resumeId: string;
  onUpdate: (resume: TResume) => void;
}

const AutomatedResumeEditor: React.FC<AutomatedResumeEditorProps> = ({
  resume,
  resumeId,
  onUpdate,
}) => {
  const [automatedInput, setAutomatedInput] = useState("");
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [modifiedResumeData, setModifiedResumeData] = useState<TResume | null>(
    resume
  );
  const { mutate: modifyResume, isPending: isModifying } =
    useAssistantModifications();
  const { mutate: updateResume } = useUpdateResume();

  const handleSaveChanges = useCallback(() => {
    if (modifiedResumeData) {
      const { matches, application, ...resumeToUpdate } = modifiedResumeData;
      updateResume({ id: resumeId, resume: resumeToUpdate });
      setShowSaveButton(false);
    }
  }, [modifiedResumeData, resumeId, updateResume]);

  const handleAutomatedModification = useCallback(() => {
    if (resumeId && automatedInput) {
      modifyResume(
        { resumeId, input: automatedInput },
        {
          onSuccess: (modifiedResume) => {
            setModifiedResumeData(modifiedResume);
            setShowSaveButton(true);
            setAutomatedInput("");
          },
        }
      );
    }
  }, [resumeId, automatedInput, modifyResume, onUpdate]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showSaveButton) {
      timeout = setTimeout(() => {
        setShowSaveButton(false);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [showSaveButton]);

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

  return (
    <div className="flex gap-6">
      <div className="w-1/2 space-y-4">
        <Textarea
          placeholder="Write what you want to change about the resume or paste in a job description"
          value={automatedInput}
          onChange={handleInputChange}
          className="h-48 mb-4"
        />
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Ask anything</AlertTitle>
          <AlertDescription>
            Our assistant will modify the resume based on your input. Feel free
            to paste in a job description!
          </AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button onClick={handleAutomatedModification} disabled={isModifying}>
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
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Button onClick={handleSaveChanges}>
                  <Check className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="w-1/2">
        <ResumePDFPreviewLoadingWrapper
          resume={modifiedResumeData as TResume}
        />
      </div>
    </div>
  );
};

export default AutomatedResumeEditor;
