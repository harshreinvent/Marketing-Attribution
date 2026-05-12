import { UserRole } from "./roles";

export type Session = {
  userId: string;
  clientId: string | null;
  role: UserRole;
  locationIds: string[];
};
