import AutomatedResumeEditor from "../AutomatedResumeEditor";
import ResumeEditor from "../ResumeEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ResumePDFPreviewLoadingWrapper from "./ResumePDFPreviewLoadingWrapper";

const ResumeEditingWrapper = () => {
  return (
    <div className="flex gap-6">
      <div className="w-1/2">
        <Tabs defaultValue="manual">
          <TabsList>
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="automated">Automated</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <ResumeEditor />
          </TabsContent>
          <TabsContent value="automated">
            <AutomatedResumeEditor />
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-1/2">
        <ResumePDFPreviewLoadingWrapper />
      </div>
    </div>
  );
};

export default ResumeEditingWrapper;
