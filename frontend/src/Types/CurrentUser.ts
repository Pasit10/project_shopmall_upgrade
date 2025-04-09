export type UserRole = "user" | "admin" | "superadmin";

export interface CurrentUser {
  uid: string;
  email: string;
  name: string;
  picture: string;
  address: string;
  tel: string;
  role: UserRole;
  login_type: string;
}
