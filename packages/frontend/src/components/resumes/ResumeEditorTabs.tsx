import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TResume } from "@redundant/common/src";
import ManualResumeEditor from "../ManualResumeEditor";
import AutomatedResumeEditor from "../AutomatedResumeEditor";

interface ResumeEditorTabsProps {
  resume: TResume;
  resumeId: string;
  onUpdate: (resume: TResume) => void;
}

const ResumeEditorTabs: React.FC<ResumeEditorTabsProps> = ({
  resume,
  resumeId,
  onUpdate,
}) => {
  return (
    <Tabs defaultValue="manual">
      <TabsList>
        <TabsTrigger value="manual">Manual</TabsTrigger>
        <TabsTrigger value="automated">Automated</TabsTrigger>
      </TabsList>
      <TabsContent value="manual">
        <ManualResumeEditor
          resume={resume}
          resumeId={resumeId}
          onUpdate={onUpdate}
        />
      </TabsContent>
      <TabsContent value="automated">
        <AutomatedResumeEditor
          resume={resume}
          resumeId={resumeId}
          onUpdate={onUpdate}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ResumeEditorTabs;
