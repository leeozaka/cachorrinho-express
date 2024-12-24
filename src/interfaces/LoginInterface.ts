export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  expires: Date;
  token: string;
}
