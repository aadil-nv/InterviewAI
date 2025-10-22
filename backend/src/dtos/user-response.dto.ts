import { UserRole } from "../interfaces/user.interface";

export class UserResponseDTO {
  _id!: string;
  email!: string;
  userName!: string;
  role!: UserRole;
  accessToken?: string;
  refreshToken?: string;
}
