import { Role } from "@common/types/enum";
import { Types } from "mongoose";

export class Admin {
  readonly _id: Types.ObjectId;

  firstName: string;
  lastName: string;
  userName: string;

  email: string;

  password: string;

  role: Role;

  isDeleted: boolean;

  deletedAt: Date;
  pendingApprovals: Types.ObjectId[];
}
