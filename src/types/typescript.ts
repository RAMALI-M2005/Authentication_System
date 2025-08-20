import { Document, Types } from "mongoose";

export type Role = "owner" | "member";

export interface WorkspaceRef {
  workspaceId: Types.ObjectId;
  role: Role;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  firstname?:string;
  lastname?:string;
  email: string;
  password?: string;
  salt?: string;
  avatarURL?: string;
  workspaces: WorkspaceRef[];
  sessionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type Cookies = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax" | "none";
      expires?: Date | number;
    }
  ) => void;
  get: (key: string) => { name: string; value: string } | undefined;
  delete: (key: string) => void;
};
