import { Role } from "@common/types/enum";
import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: Role[]) =>
  SetMetadata('roles', roles);