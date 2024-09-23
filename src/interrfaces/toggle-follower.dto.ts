import { Users } from "@prisma/client";

export interface ToggleFollowDTO {
  user: Users;
  userId: string;
}
