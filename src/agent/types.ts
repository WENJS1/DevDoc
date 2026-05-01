export interface CommitContext {
  commitHash: string;
  message: string;
  diff: string;
  filesChanged: string[];
}

export interface DocLocation {
  file: string;
  section: string;
  reason: string;
  originalContent: string;
}

export interface VerificationResult {
  passed: boolean;
  reason: string;
  feedback?: string;
}

export interface AgentContext {
  commit: CommitContext;
  locationsToUpdate: DocLocation[];
  generatedUpdates: Record<string, string>; // file -> new content
  verificationResults: Record<string, VerificationResult>;
  attempts: number;
}
