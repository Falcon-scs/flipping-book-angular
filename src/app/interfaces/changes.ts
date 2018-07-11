export enum ProofChangeStatus {
  PENDING,
  COMPLETE
}

export enum ProofChangeType {
  PAGE,
  PHOTO
}

export interface ProofChange {
  type: ProofChangeType;
  status: ProofChangeStatus;
  action: string;
  thumbnail: string;
  message?: string;
}
