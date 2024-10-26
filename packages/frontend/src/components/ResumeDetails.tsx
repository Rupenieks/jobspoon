import React, { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useReadResumes } from "@/hooks/useReadResumes";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";

const ResumeDetails: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { data: resumes } = useReadResumes();
  const navigate = useNavigate();

  const resume = useMemo(() => {
    return resumes?.find((r) => r.id === resumeId);
  }, [resumes, resumeId]);

  if (!resume) {
    return <div>Resume not found</div>;
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

      <Breadcrumb>
        <BreadcrumbItem>
          <Link
            to="/resumes"
            className="text-muted-foreground hover:text-foreground"
          >
            Resumes
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>{resume.positionName}</BreadcrumbItem>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">{resume.positionName}</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{resume.fullName}</h2>
        <p>{resume.email}</p>
        <p>{resume.phoneNumber}</p>
        <p>
          {resume.address}, {resume.city}, {resume.country}
        </p>

        <h3 className="text-lg font-semibold mt-6">Experience</h3>
        {resume.experience?.map((exp, index) => (
          <div key={index} className="ml-4">
            <h4 className="font-medium">
              {exp.positionTitle} at {exp.company}
            </h4>
            <p>
              {exp.startDate} - {exp.endDate}
            </p>
            <ul className="list-disc list-inside">
              {exp.contributions?.map((contribution, i) => (
                <li key={i}>{contribution}</li>
              ))}
            </ul>
          </div>
        ))}

        <h3 className="text-lg font-semibold mt-6">Education</h3>
        {resume.education?.map((edu, index) => (
          <div key={index} className="ml-4">
            <h4 className="font-medium">
              {edu.degree} at {edu.university}
            </h4>
            <p>
              {edu.startDate} - {edu.endDate}
            </p>
          </div>
        ))}

        <h3 className="text-lg font-semibold mt-6">Skills</h3>
        <ul className="list-disc list-inside">
          {resume.skills?.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResumeDetails;
