import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Terminal, Check } from "lucide-react";
import { TResume } from "@redundant/common/src";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import ResumeEditor from "./ResumeEditor";
import { Separator } from "@/components/ui/separator";
import ResumePDFPreviewLoadingWrapper from "./resumes/ResumePDFPreviewLoadingWrapper";
import { useUpdateResume } from "@/hooks/useUpdateResume";
import { useReadResume } from "@/hooks/useReadResume";
import { ResumeSkeleton } from "./skeletons/ResumeSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CustomColorRing from "./loaders/ColorRing";
import { useAssistantModifications } from "@/hooks/useAssistantModifications";

const ResumeDetails: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const { data: resume, isLoading, error } = useReadResume(resumeId!);
  const { mutate: updateResume } = useUpdateResume();
  const { mutate: modifyResume, isPending: isModifying } =
    useAssistantModifications();

  const [editedResume, setEditedResume] = useState<TResume | null>(null);
  const [automatedResume, setAutomatedResume] = useState<TResume | null>(null);
  const [automatedInput, setAutomatedInput] = useState("");
  const [activeTab, setActiveTab] = useState<"manual" | "automated">("manual");
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (resume) {
      setEditedResume(resume);
      setAutomatedResume(resume);
    }
  }, [resume]);

  const debouncedResume = useDebouncedValue(editedResume, 1000);
  const debouncedUpdateResume = useDebouncedValue(editedResume, 3000);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debouncedUpdateResume && resumeId) {
      const { matches, application, ...resumeToUpdate } = debouncedUpdateResume;
      updateResume({ id: resumeId, resume: resumeToUpdate });
    }
  }, [debouncedUpdateResume, resumeId, updateResume, isInitialMount]);

  const handleResumeUpdate = useCallback((updatedResume: TResume) => {
    setEditedResume(updatedResume);
  }, []);

  const handleAutomatedInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setAutomatedInput(e.target.value);
    },
    []
  );

  const handleAutomatedModification = useCallback(() => {
    if (resumeId && automatedInput) {
      modifyResume(
        { resumeId, input: automatedInput },
        {
          onSuccess: (modifiedResume) => {
            setAutomatedResume(modifiedResume);
            setAutomatedInput("");
          },
        }
      );
    }
  }, [resumeId, automatedInput, modifyResume]);

  const handleSaveAutomatedChanges = useCallback(() => {
    if (automatedResume) {
      setEditedResume(automatedResume);
      updateResume({ id: resumeId!, resume: automatedResume });
    }
  }, [automatedResume, resumeId, updateResume]);

  const colorRingColors = useMemo(
    () => ["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"],
    []
  );

  if (isLoading || !editedResume) {
    return <ResumeSkeleton />;
  }

  if (error) {
    return <div>Error loading resume</div>;
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

      <h1 className="text-2xl font-bold">{editedResume.positionName}</h1>

      <div className="flex gap-6">
        <div className="w-1/2 space-y-8">
          <Tabs
            defaultValue="manual"
            onValueChange={(value) =>
              setActiveTab(value as "manual" | "automated")
            }
          >
            <TabsList>
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="automated">Automated</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <ResumeEditor
                resume={editedResume}
                onUpdate={handleResumeUpdate}
              />
            </TabsContent>
            <TabsContent value="automated">
              <Textarea
                placeholder="Write what you want to change about the resume or paste in a job description"
                value={automatedInput}
                onChange={handleAutomatedInputChange}
                className="h-48 mb-4"
              />
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Ask anything</AlertTitle>
                <AlertDescription>
                  Our assistant will modify the resume based on your input. Feel
                  free to paste in a job description!
                </AlertDescription>
              </Alert>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleAutomatedModification}
                  disabled={isModifying}
                >
                  {isModifying ? (
                    <CustomColorRing
                      colors={
                        colorRingColors as [
                          string,
                          string,
                          string,
                          string,
                          string
                        ]
                      }
                    />
                  ) : (
                    "Modify Resume"
                  )}
                </Button>
                {automatedResume !== editedResume && (
                  <Button onClick={handleSaveAutomatedChanges}>
                    <Check className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Separator orientation="vertical" />

        <div className="w-1/2">
          <ResumePDFPreviewLoadingWrapper
            resume={
              activeTab === "manual"
                ? (debouncedResume as TResume)
                : (automatedResume as TResume)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeDetails;
