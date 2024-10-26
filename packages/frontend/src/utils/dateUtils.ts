import { parse, isValid } from "date-fns";

export function parseResumeDate(
  dateString: string | undefined
): Date | undefined {
  if (!dateString) return undefined;

  // Try parsing with various formats
  const formats = [
    "MM/yyyy",
    "M/yyyy",
    "yyyy-MM-dd",
    "yyyy-MM",
    "MM/dd/yyyy",
    "M/d/yyyy",
  ];

  for (const format of formats) {
    const parsedDate = parse(
      dateString.replace(/['"]/g, ""),
      format,
      new Date()
    );
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  // If all parsing attempts fail, return undefined
  console.warn(`Unable to parse date: ${dateString}`);
  return undefined;
}
