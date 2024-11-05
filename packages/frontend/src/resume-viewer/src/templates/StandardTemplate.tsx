import { TResumeData } from "@redundant/common/src";
import { useMemo } from "react";

interface StandardTemplateProps {
  resume: TResumeData;
  pageIndex: number;
}

export const StandardTemplate = ({ resume, pageIndex }: StandardTemplateProps) => {
  const config = useMemo(
    () => ({
      ...{
        primaryColor: "#1f2937",
        fontSize: 16,
        font: "Roboto",
        margin: 25.4,
      },
      ...resume.config,
    }),
    [resume.config]
  );

  const profileSection = useMemo(() => {
    if (!resume.profileImage)
      return (
        <div className="flex gap-6 items-start mb-8">
          <div>
            <h1 style={{ fontSize: "2em" }} className="font-bold">
              {resume.personalInfo.fullName}
            </h1>
            <p
              style={{ fontSize: "1.15em" }}
              className="text-gray-600 uppercase tracking-wide"
            >
              {resume.personalInfo.positionName}
            </p>
          </div>
        </div>
      );

    return (
      <div className="flex gap-6 items-start mb-8">
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={resume.profileImage}
            alt="Profile"
            className="rounded-full w-full h-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", e);
              e.currentTarget.style.display = "none";
            }}
            crossOrigin="anonymous"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
          />
        </div>
        <div>
          <h1 style={{ fontSize: "2em" }} className="font-bold">
            {resume.personalInfo.fullName}
          </h1>
          <p
            style={{ fontSize: "1.15em" }}
            className="text-gray-600 uppercase tracking-wide"
          >
            {resume.personalInfo.positionName}
          </p>
        </div>
      </div>
    );
  }, [resume.personalInfo.fullName, resume.personalInfo.positionName, resume.profileImage]);

  const experienceSection = useMemo(() => {
    if (!resume.experience?.length) return null;

    return (
      <div className="space-y-8">
        <h2 style={{ fontSize: "1.5em" }} className="font-bold mb-4">
          Employment History
        </h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="space-y-2">
            <h3 style={{ fontSize: "1.25em" }} className="font-semibold">
              {exp.positionTitle}, {exp.company}
            </h3>
            <p
              className="text-gray-600 uppercase tracking-wide"
              style={{ fontSize: "0.875em" }}
            >
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
      <div className="space-y-6">
        <h2 style={{ fontSize: "1.5em" }} className="font-bold mb-2">
          Education
        </h2>
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

  const renderSection = (sectionType: string) => {
    switch (sectionType) {
      case "personalInfo":
        return profileSection;
      case "experience":
        return experienceSection;
      case "education":
        return educationSection;
      default:
        return null;
    }
  };

  return (
    <div
      className="flex min-h-[297mm] w-[210mm] relative"
      style={{
        fontSize: `${config.fontSize}px`,
        fontFamily: config.font,
      }}
    >
      {/* Main content container */}
      <div className="flex-grow">
        <div
          style={{
            marginLeft: `${config.margin}mm`,
            marginRight: `${config.margin}mm`,
            marginTop: `25.4mm`,
            marginBottom: `25.4mm`,
          }}
          className="space-y-8"
        >
          {resume.pages[pageIndex].sections.map((section) => (
            <div key={section.id}>{renderSection(section.type)}</div>
          ))}
        </div>
      </div>

      {/* Sidebar container */}
      <div className="w-80 relative">
        {/* Background that extends full height */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: config.primaryColor }}
        />

        {/* Content with margins */}
        <div
          className="relative text-white"
          style={{
            marginLeft: `${config.margin}mm`,
            marginRight: `${config.margin}mm`,
            marginTop: `25.4mm`,
          }}
        >
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <div className="space-y-2">
            {resume.personalInfo.address && <p>{resume.personalInfo.address}</p>}
            {resume.personalInfo.city && <p>{resume.personalInfo.city}</p>}
            {resume.personalInfo.country && <p>{resume.personalInfo.country}</p>}
            {resume.personalInfo.phoneNumber && <p>{resume.personalInfo.phoneNumber}</p>}
            {resume.personalInfo.email && <p>{resume.personalInfo.email}</p>}
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
      </div>
    </div>
  );
};
