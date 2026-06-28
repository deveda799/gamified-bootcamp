export type AssignmentDetail = {
  id: string;
  title: string;
  descriptionMd: string;
  allowText: boolean;
  allowLink: boolean;
  allowFile: boolean;
  submission: {
    id: string;
    status: "draft" | "submitted";
    textContent: string | null;
    linkUrl: string | null;
    assets: SubmissionAsset[];
  } | null;
};

export type SubmissionAsset = {
  id: string;
  objectKey: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};

export type AssignmentSubmitResult = {
  submissionId: string;
  status: "submitted";
  alreadySubmitted: boolean;
  pointsAdded: number;
  submittedAssignments: number;
  newBadges: string[];
};

export interface AssignmentRepository {
  getById(input: {
    userId: string;
    assignmentId: string;
  }): Promise<AssignmentDetail | null>;
  saveDraft(input: {
    userId: string;
    assignmentId: string;
    textContent: string | null;
    linkUrl: string | null;
  }): Promise<{ submissionId: string; status: "draft" }>;
  confirmAsset(input: {
    userId: string;
    assignmentId: string;
    submissionId: string;
    asset: Omit<SubmissionAsset, "id">;
  }): Promise<SubmissionAsset>;
  submit(input: {
    userId: string;
    assignmentId: string;
    textContent: string | null;
    linkUrl: string | null;
    now: Date;
  }): Promise<AssignmentSubmitResult>;
}
