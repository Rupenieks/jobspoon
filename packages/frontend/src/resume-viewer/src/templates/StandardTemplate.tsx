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
        primaryColor: "#ffffff",
        sidebarColor: "#1f2937",
        fontColor: "#000000",
        sidebarFontColor: "#ffffff",
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
        <div className="space-y-4">
          <div className="flex gap-6 items-start">
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
          {resume.personalInfo.profileBio && (
            <p style={{ fontSize: "1em" }} className="leading-relaxed">
              {resume.personalInfo.profileBio}
            </p>
          )}
        </div>
      );

    return (
      <div className="space-y-4">
        <div className="flex gap-6 items-start">
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
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        {resume.personalInfo.profileBio && (
          <p style={{ fontSize: "1em" }} className="leading-relaxed">
            {resume.personalInfo.profileBio}
          </p>
        )}
      </div>
    );
  }, [resume.personalInfo.fullName, resume.personalInfo.positionName, resume.personalInfo.profileBio, resume.profileImage]);

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
              className="uppercase tracking-wide"
              style={{ fontSize: "0.875em" }}
            >
              {exp.startDate} — {exp.endDate}
            </p>
            {exp.contributions && (
              <ul className="list-disc list-inside space-y-1 mt-2">
                {exp.contributions.map((contribution, i) => (
                  <li key={i}>
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
            <p>{edu.degree}</p>
            <p>
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

  const currentPage = resume.pages[pageIndex];
  const hasPersonalInfo = currentPage.sections.some(s => s.type === "personalInfo");
  const hasSkills = currentPage.sections.some(s => s.type === "skills");

  return (
    <div
      className="flex min-h-[297mm] w-[210mm] relative"
      style={{
        fontSize: `${config.fontSize}px`,
        fontFamily: config.font,
        backgroundColor: config.primaryColor,
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
            color: config.fontColor,
       
          }}
          className="space-y-8"
        >
          {currentPage.sections.map((section) => (
            <div key={section.id}>{renderSection(section.type)}</div>
          ))}
        </div>
      </div>

      {/* Always render sidebar, but conditionally show content */}
      <div 
        className="relative"
        style={{ width: '70mm' }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: config.sidebarColor }}
        />

        <div
          className="relative"
          style={{
            marginLeft: `${config.margin}mm`,
            marginRight: `${config.margin}mm`,
            marginTop: `25.4mm`,
            color: config.sidebarFontColor,
          }}
        >
          {hasPersonalInfo && (
            <>
              <h2 className="text-xl font-semibold mb-4 bg-transparent">Details</h2>
              <div className="space-y-2">
                {resume.personalInfo.address && <p>{resume.personalInfo.address}</p>}
                {resume.personalInfo.city && <p>{resume.personalInfo.city}</p>}
                {resume.personalInfo.country && <p>{resume.personalInfo.country}</p>}
                {resume.personalInfo.phoneNumber && <p>{resume.personalInfo.phoneNumber}</p>}
                {resume.personalInfo.email && <p>{resume.personalInfo.email}</p>}
              </div>
            </>
          )}

          {hasSkills && resume.skills && resume.skills.length > 0 && (
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
