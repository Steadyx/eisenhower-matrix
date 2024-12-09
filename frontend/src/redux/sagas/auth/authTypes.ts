export interface AuthResponse {
  token: string;
  username: string;
  error?: string;
  status: number;
}
