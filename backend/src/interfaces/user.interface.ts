export enum UserRole {
  Admin = "admin",
  User = "user",
  Manager = "manager"
}

export interface IUserEntity {
  _id?: string;
  email: string;
  userName: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}
