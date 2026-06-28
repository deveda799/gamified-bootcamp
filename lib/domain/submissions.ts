export type SubmissionStatus = "draft" | "submitted" | "withdrawn";

export function canSubmitAssignment(input: {
  allowText: boolean;
  allowLink: boolean;
  allowFile: boolean;
  textContent?: string | null;
  linkUrl?: string | null;
  assetCount: number;
}): boolean {
  const hasText = input.allowText && Boolean(input.textContent?.trim());
  const hasLink = input.allowLink && Boolean(input.linkUrl?.trim());
  const hasFile = input.allowFile && input.assetCount > 0;

  return hasText || hasLink || hasFile;
}

