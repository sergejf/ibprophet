/** Russell Group "Informed Choices" facilitating subjects, mapped to IB DP equivalents */

export const ALWAYS_FACILITATING = new Set([
  "Mathematics: Analysis and Approaches",
  "English A: Literature",
  "English A: Language and Literature",
  "Physics",
  "Biology",
  "Chemistry",
  "Geography",
  "History",
]);

/** Language B subjects are facilitating only when taken at HL */
export const FACILITATING_AT_HL = new Set([
  "French B",
  "Spanish B",
  "German B",
  "Italian B",
  "Chinese B",
  "Russian B",
]);

export function isFacilitating(name: string, isHL: boolean): boolean {
  if (ALWAYS_FACILITATING.has(name)) return true;
  if (isHL && FACILITATING_AT_HL.has(name)) return true;
  return false;
}
