export interface SessionResponse {
  data: ApiResponse | null;
  error: unknown;
}
export interface ApiResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: string;
  };
}
export type UserRole = "USER" | "RECRUITER" | "ADMIN";
