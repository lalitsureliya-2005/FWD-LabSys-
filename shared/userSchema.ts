export interface User {
  id: string;
  username: string;
  passwordHash?: string; // This will be stored in the DB
  createdAt: Date;
}

export type InsertUser = Omit<User, "id" | "passwordHash" | "createdAt"> & { password: string };
export type PublicUser = Omit<User, "passwordHash">;
