import { TResume } from "@redundant/common";
import { useMemo } from "react";

interface StandardTemplateProps {
  resume: TResume;
}

export const StandardTemplate = ({ resume }: StandardTemplateProps) => {
  const profileSection = useMemo(() => {
    return (
      <div className="flex gap-6 items-start mb-8">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="rounded-full w-24 h-24"
        />
        <div>
          <h1 className="text-3xl font-bold">{resume.fullName}</h1>
          <p className="text-lg text-gray-600 uppercase tracking-wide">
            {resume.positionName}
          </p>
        </div>
      </div>
    );
  }, [resume.fullName, resume.positionName, resume.summary]);

  const detailsSection = useMemo(() => {
    return (
      <div className="bg-navy-900 p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Details</h2>
        <div className="space-y-2">
          {resume.address && <p>{resume.address}</p>}
          {resume.city && <p>{resume.city}</p>}
          {resume.country && <p>{resume.country}</p>}
          {resume.phoneNumber && <p>{resume.phoneNumber}</p>}
          {resume.email && <p>{resume.email}</p>}
        </div>

        {resume.skills && resume.skills.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-8 mb-4">Skills</h2>
            <div className="space-y-2">
              {resume.skills.map((skill, index) => (
                <p key={index}>{skill}</p>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }, [
    resume.address,
    resume.city,
    resume.country,
    resume.phoneNumber,
    resume.email,
    resume.skills,
  ]);

  const experienceSection = useMemo(() => {
    if (!resume.experience?.length) return null;

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold mb-6">Employment History</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-xl font-semibold">
              {exp.positionTitle}, {exp.company}
            </h3>
            <p className="text-gray-600 uppercase text-sm tracking-wide">
              {exp.startDate} — {exp.endDate}
            </p>
            {exp.contributions && (
              <ul className="list-disc list-inside space-y-1 mt-2">
                {exp.contributions.map((contribution, i) => (
                  <li key={i} className="text-gray-700">
                    {contribution}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }, [resume.experience]);

  const educationSection = useMemo(() => {
    if (!resume.education?.length) return null;

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold mb-6">Education</h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-xl font-semibold">{edu.university}</h3>
            <p className="text-gray-700">{edu.degree}</p>
            <p className="text-gray-600">
              {edu.startDate} — {edu.endDate}
            </p>
          </div>
        ))}
      </div>
    );
  }, [resume.education]);

  return (
    <div className="flex gap-8">
      <div className="flex-grow space-y-8">
        {profileSection}
        {experienceSection}
        {educationSection}
      </div>
      <div className="w-80 flex-shrink-0">{detailsSection}</div>
    </div>
  );
};
