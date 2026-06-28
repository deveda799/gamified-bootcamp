export type SignedUpload = {
  objectKey: string;
  uploadUrl: string;
  method: "PUT";
  headers: Record<string, string>;
  expiresAt: string;
};

export interface FileStorage {
  createSignedUpload(input: {
    objectKey: string;
    contentType: string;
  }): Promise<SignedUpload>;
  createSignedDownload(objectKey: string): Promise<{
    downloadUrl: string;
    expiresAt: string;
  }>;
}
