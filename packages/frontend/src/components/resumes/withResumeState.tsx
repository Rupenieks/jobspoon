import React from "react";
import { useParams } from "react-router-dom";
import { ResumeStateProvider } from "./ResumeStateContext";

export const withResumeState = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithResumeStateWrapper(props: P) {
    const { resumeId } = useParams<{ resumeId: string }>();

    if (!resumeId) {
      return null;
    }

    return (
      <ResumeStateProvider resumeId={resumeId}>
        <WrappedComponent {...props} />
      </ResumeStateProvider>
    );
  };
};
