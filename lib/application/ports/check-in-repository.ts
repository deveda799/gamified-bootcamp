export type CheckInResult = {
  localDate: string;
  alreadyCheckedIn: boolean;
  pointsAdded: number;
  checkInDays: number;
  newBadges: string[];
};

export type CheckInItem = {
  id: string;
  localDate: string;
  note: string | null;
  createdAt: string;
};

export interface CheckInRepository {
  getMine(userId: string): Promise<CheckInItem[]>;
  checkInToday(input: {
    userId: string;
    note?: string;
    now: Date;
  }): Promise<CheckInResult>;
}
