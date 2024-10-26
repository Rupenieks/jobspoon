import React from "react";
import { TResume } from "@redundant/common/src";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface ResumePreviewProfessionalProps {
  resume: TResume;
}

const ResumePreviewProfessional: React.FC<ResumePreviewProfessionalProps> = ({
  resume,
}) => {
  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <div className="w-2/3 p-8">
        <header className="mb-6">
          <div className="flex items-center">
            <Avatar className="w-24 h-24 mr-6">
              <AvatarImage src={resume.picture} alt={resume.fullName} />
              <AvatarFallback>
                {resume.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold">{resume.fullName}</h1>
              <p className="text-xl text-gray-600 mt-2">
                {resume.positionName}
              </p>
            </div>
          </div>
        </header>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Profile</h2>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Employment History</h2>
          {resume.experience?.map((job, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold">
                {job.positionTitle}, {job.company}
              </h3>
              <p className="text-gray-600 mb-2">
                {job.startDate} — {job.endDate || "PRESENT"}
              </p>
              <ul className="list-disc list-inside">
                {job.contributions?.map((contribution, i) => (
                  <li key={i}>{contribution}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Education</h2>
          {resume.education?.map((edu, index) => (
            <div key={index} className="mb-2">
              <h3 className="text-lg font-semibold">{edu.degree}</h3>
              <p>
                {edu.university}, {edu.startDate} - {edu.endDate}
              </p>
            </div>
          ))}
        </section>
      </div>

      <div className="w-1/3 bg-gray-900 text-white p-8">
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Details</h2>
          <p>
            {resume.city}, {resume.country}
          </p>
          <p>{resume.phoneNumber}</p>
          <p>{resume.email}</p>
        </section>

        <Separator className="bg-gray-700 my-6" />

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Links</h2>
          <p>LinkedIn</p>
          <p>GitHub</p>
        </section>

        <Separator className="bg-gray-700 my-6" />

        <section>
          <h2 className="text-xl font-semibold mb-3">Skills</h2>
          <ul>
            {resume.skills?.map((skill, index) => (
              <li key={index} className="mb-1">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ResumePreviewProfessional;
