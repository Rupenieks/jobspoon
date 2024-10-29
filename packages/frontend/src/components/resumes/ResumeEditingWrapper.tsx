import AutomatedResumeEditor from "../AutomatedResumeEditor";
import ResumeEditor from "../ResumeEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ResumePreviewFrame from "./ResumePreviewFrame";

const ResumeEditingWrapper = () => {
  return (
    <div className="flex gap-6 min-h-screen">
      <div className="w-1/3 overflow-y-auto p-1">
        <Tabs defaultValue="manual" className="sticky top-0">
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
      <div className="w-2/3 sticky top-0 max-h-[632px]">
        <ResumePreviewFrame />
      </div>
    </div>
  );
};

export default ResumeEditingWrapper;
